import express from "express";
import cors from "cors";
import productRouter from './router/product.router';
import userRouter from './router/user.router';
import bodyParser from 'body-parser';
import orderRouter from './router/order.router'
import dotenv from 'dotenv';
import { dbConnect } from "./config/database.config";

dotenv.config();
dbConnect();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Set EJS as templating engine 
//app.set("view engine", "ejs");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// frontend localhost
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:4200"],
  })
);

// backend localhost
const port = 5000;
app.listen(port, () => {
  console.log("success connected port");
});


//For image
app.use('/uploads' , express.static('uploads'));
app.use("/api/products", productRouter)
app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)







