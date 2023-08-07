import Router from "express";
import jwt from "jsonwebtoken";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import { UserModel, User } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constant/http_status";
import dotenv from 'dotenv';
import {upload} from "../constant/image_function"


dotenv.config();
const router = Router();
router.get("/seed",asyncHandler(async (req, res) => {
    const userCount = await UserModel.countDocuments();
    await UserModel.create(sample_users);
    res.send("User plant success");
  })
);

router.get('/userDetail/:id', asyncHandler(async(req,res)=>{
  const user = await UserModel.findById(req.params.id)
  if (user) {
    res.send(user);
  } else {
    res.status(HTTP_BAD_REQUEST).send("no data for the this user id");
  }
}))

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      res.send(generateTokenReponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("User name or password is invalid");
    }
  })
);

router.put('/preference', asyncHandler(async (req,res)=>{
  const {userId, prodId, rating} = req.body
  const user = await UserModel.findById(userId)
  let preference = user.preference
  const index = preference.findIndex((prefer) => prefer.product == prodId)
  if(index != -1){
    preference[index] = {product:prodId, rating:rating}
  }else{
    preference.push({product:prodId, rating:rating})
  }
  const updatePrefer = await UserModel.findByIdAndUpdate(userId, {$set:{preference:preference}})
  res.send({updatePrefer})
}))

router.post('/resetPassword', asyncHandler(async (req,res)=>{
  const {email, password} = req.body
  const user = await UserModel.findOne({email});
  if(user){
    await UserModel.updateOne({email:email},{$set:{password:password}})
  }else{
    res.status(HTTP_BAD_REQUEST).send("Email not found")
    return
  }
  res.send(user)
}))

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, email, password} = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("user already exist");
      return;
    }

    //const encryptedPassword = await bcrypt.hash(password, 10); // set secure level
    
    const newUser = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: password,
      isAdmin: false,
    };
    const dbuser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbuser))
  })
);

router.put("/update", upload.single('avatar'), asyncHandler(async (req,res)=>{
  const url = req.protocol + '://' + req.get('host')
  let data = JSON.parse(req.body.data)
  let changeFile = req.body.avatar? req.body.avatar : url+ '/uploads/'+ req.file.filename
  const user = {
    password: data.password,
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: changeFile,
    country: data.country,
    address: data.address,
    isAdmin: data.isAdmin
  }
  await UserModel.findByIdAndUpdate(data.id, {$set:user})
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))

router.get('/', asyncHandler(async (req,res)=>{
  await UserModel.find()
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))

router.delete('/delete/:id', asyncHandler(async (req,res)=>{
  await UserModel.findByIdAndDelete(req.params.id)
  .then(doc=>{res.send(doc)})
  .catch(err=>res.status(HTTP_BAD_REQUEST).send(err))
}))


const generateTokenReponse = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    avatar: user.avatar,
    country: user.country,
    phone: user.phone,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    preference: user.preference,
    token: token,
  };
};

export default router;
