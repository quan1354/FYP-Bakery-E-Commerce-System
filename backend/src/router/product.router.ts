import { Router } from "express";
import { sample_products, sample_tags } from "../data";
import asynceHandler from "express-async-handler";
import multer from "multer";
import { ProductModel } from "../models/product.model";
import { HTTP_BAD_REQUEST } from "../constant/http_status";
import { UserModel } from "../models/user.model";
import {upload} from "../constant/image_function"

const router = Router();
// seed default data
router.get("/seed",asynceHandler(async (req, res) => {
    const productCount = await ProductModel.countDocuments();
    if (productCount > 0) {
      res.send("Seed is already planted");
      return;
    }
    await ProductModel.create(sample_products);
    res.send("Seed Plant Success");
  })
);

// get all products
router.get("/",asynceHandler(async (req, res) => {
    await ProductModel.find()
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  })
);

// get all tags
router.get("/category", asynceHandler(
  async (req, res) => {
    const tags = await ProductModel.aggregate([
      {
        $unwind:'$category'
      },
      {
        $group:{
          _id:'$category',
          count: {$sum: 1}
        }
      },{
        $project:{
          _id:0,
          name:'$_id',
          count:'$count'
        }
      }
    ]).sort({count: -1})

    const all = {
      name: 'All',
      count: await ProductModel.countDocuments()
    }
    tags.unshift(all)
    res.send(tags)
  }
));

// get product by search term 
router.get("/search/:searchTerm",
  asynceHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    await ProductModel.find({ name: { $regex: searchRegex } })
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  })
);

// get product by category
router.get("/category/:cat",
  asynceHandler(async (req, res) => {
    await ProductModel.find({ category: req.params.category })
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  })
);

//update product rating
router.put("/rating",asynceHandler(async (req,res)=>{
  let data = req.body
  //let data = JSON.parse(req.body.data)
  await ProductModel.findByIdAndUpdate(data.id,{$set:{rating:data.rating}})
  .then(doc=>{
    console.log(doc)
    res.send(doc)
    
  })
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}));

// find product by id
router.get("/productid/:id",asynceHandler(async (req, res) => {
    await ProductModel.findById(req.params.id)
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  })
);

//create product
router.post("/create",upload.single('image'),asynceHandler(async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  let name = req.body.name;
  //let stock = req.body.stockQuantity ? req.body.stockQuantity : 1
  let priceHolder = {type:req.body.type, priceValue:req.body.price, stockQuantity:req.body.stockQuantity}
  const product = await ProductModel.findOne({ name });
  if (product) {
    res.status(HTTP_BAD_REQUEST).send("product already exist");
    return;
  }

  const newProduct = new ProductModel ({
    id: "",
    name: req.body.name,
    price: priceHolder,
    tag: req.body.tag,
    imageUrl: url+ '/uploads/'+ req.file.filename,
    description: req.body.description,
    category: req.body.category,
    status: req.body.status,
  });
  await newProduct.save()
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err));
})
);

//update product
router.put("/update", upload.single('image'), asynceHandler(async (req,res)=>{
  console.log(req.body)
  const url = req.protocol + '://' + req.get('host')
  let changeFile = req.body.image? req.body.image : url+ '/uploads/'+ req.file.filename
  let tags = req.body.tag? req.body.tag : []
  let priceHolder = {type:req.body.type, priceValue:req.body.price, stockQuantity:req.body.stockQuantity}
  const product = {
    name: req.body.name,
    price: priceHolder,
    tag: tags,
    imageUrl: changeFile,
    description: req.body.description,
    //rating: req.body.rating,
    category: req.body.category,
    status: req.body.status,
  }
  await ProductModel.findByIdAndUpdate(req.body.id,{$set:product})
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))

// delete product
router.delete("/delete/:id",asynceHandler(async (req, res) => {
    await ProductModel.findByIdAndDelete(req.params.id)
    .then(async (doc)=>{
      await UserModel.updateMany({preference:{$exists:true}},{$pull:{'preference':{product:req.params.id}}})
      res.send(doc)
    })
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  })
);

export default router;
