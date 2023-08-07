import { Schema, Types, model} from "mongoose";
import { OrderStatus } from "../constant/order_status";
import { Product, ProductSchema } from "./product.model";


export interface LatLng{
    lat:string;
    lng:string;
}

export const LatLngSchema = new Schema <LatLng>(
    {
        lat:{type:String, required:true},
        lng:{type:String, required:true}
    }
);

export interface OrderItem{
    product: Product;
    price:number;
    quantity:number;
}

export const OrderItemSchema = new Schema<OrderItem>({
    product:{type:ProductSchema, required:false},
    //price:{type:Number, required:true},
    quantity: {type:Number, required: true}
});

export interface Order{
    id:String;
    item: OrderItem[];
    totalPrice:number;
    orderName:string;
    orderType:string;
    address:string;
    addressLatLng:LatLng;
    paymentId:string;
    status:OrderStatus;
    user:Types.ObjectId;
    createdAt:Date;
    updateAt:Date
    paymentSlip:string;
    receiveOrdertime: string;
    receiveOrderDate:Date;
    phone:string;
    email:string;
    country:string;
    additionalInfo:string;
}

const orderSchema = new Schema<Order>({
    orderName:{type:String, required:true},
    orderType:{type:String,required:true},
    address:{type:String, required:false},
    item:{type:[OrderItemSchema], required:true},//
    addressLatLng:{type:LatLngSchema, required:false},
    paymentId:{type:String},
    totalPrice:{type:Number, required:true},
    status:{type:String,default:OrderStatus.NEW},
    user:{type:Schema.Types.ObjectId, required:true},
    paymentSlip:{type:String,required:false},
    receiveOrdertime:{type:String,required:true},
    receiveOrderDate:{type:Date,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true},
    country:{type:String,required:false},
    additionalInfo:{type:String,required:false},

},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
});

export const orderModel = model('order', orderSchema)