import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constant/http_status';
import { OrderStatus } from '../constant/order_status';
import authMid from '../middleware/auth.mid';
import { orderModel } from '../models/order.model';
import {upload} from "../constant/image_function"
import { generate } from 'shortid';
const router = Router();
router.use(authMid);



// get All orders
router.get("/",asyncHandler(async(req,res)=>{
    await orderModel.find()
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))

//create Order ##
router.post('/create',asyncHandler(async (req:any,res:any)=>{
    const requestOrder = req.body;
    console.log(req.body)

    if(requestOrder.item.length < 0){
        res.status(HTTP_BAD_REQUEST).send('Cart is Empty !!')
        return
    }
    const newOrder = new orderModel({...requestOrder,user:req.user.id});
    await newOrder.save()
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
    //res.send(newOrder)
}))

//update order
router.put("/update", upload.single('paymentSlip'), asyncHandler(async (req,res)=>{
  let data = JSON.parse(req.body.data)
  const url = req.protocol + '://' + req.get('host')
  const paymentSlip = req.body.paymentSlip?data.paymentSlip:url+ '/uploads/'+ req.file.filename
  const order = {
    totalPrice: data.totalPrice,
    orderName: data.orderName,
    orderType: data.orderType,
    address: data.address,
    status: data.status,
    receiveOrdertime: data.receiveOrdertime,
    email: data.email,
    phone: data.phone,
    country: data.country,
    receiveOrderDate: data.receiveOrderDate,
    additionalInfo:data.additionalInfo,
    addressLatLng:data.addressLatLng,
    paymentId:data.paymentId,
    paymentSlip:paymentSlip
  }
  await orderModel.findByIdAndUpdate(data.id,{$set:order},{new:true})
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  }))

//delete order
router.delete('/delete/:id', asyncHandler(async (req,res)=>{
  if(req.params.id == 'all'){
    await orderModel.deleteMany({status:OrderStatus.NEW})
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  }else{
    await orderModel.findByIdAndDelete(req.params.id)
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
  }
}))

// get new order ##
router.get('/newOrderForCurrentUser',asyncHandler(async(req:any,res)=>{
    await orderModel.findOne({user:req.user.id, status:OrderStatus.NEW})
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
    // if(order){
    //   res.status(HTTP_BAD_REQUEST).send("Exist new order")
    // }else{
    //   res.send(order)
    // }
}))

// make payment ##
router.put('/pay', upload.single('paymentSlip'),asyncHandler(async(req:any,res)=>{
    req.body = JSON.parse(JSON.stringify(req.body));
    const url = req.protocol + "://" + req.get("host");
    const order = await orderModel.findOne({user:req.user.id, status:OrderStatus.NEW})
    if(!order){
        res.status(HTTP_BAD_REQUEST).send('order not found!')
        return
    }

    if(req.body.hasOwnProperty('paymentId')){
        order.paymentId = req.body.paymentId;
        order.status = OrderStatus.PAID;
    }else{
        order.paymentSlip = url+ '/uploads/'+ req.file.filename;
        order.status = OrderStatus.PROCESS;
    }

    await order.save()
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))

}))

// get a user of orders
router.get('/myOrder', asyncHandler(async (req:any,res)=>{
    await orderModel.find({user:req.user.id})
    .then(doc=>{res.send(doc)})
    .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))

export default router;