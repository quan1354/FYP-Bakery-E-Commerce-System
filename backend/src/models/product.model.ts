import { Schema, model } from "mongoose";

export interface Product {
  id: string;
  name: string;
  price: object;
  tag: string[];
  imageUrl: string;
  description: string;
  rating:number;
  category: string;
  status: string;
}

export interface Price{
  type:string,
  priceValue:number,
  stockQuantity:number
}

export const priceSchema = new Schema <Price>({
  type:{type:String, required:false},
  priceValue:{type:Number,required:true},
  stockQuantity:{type:Number,required:false}
})


export const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true},
    price: { type: priceSchema, required: true },
    tag: { type: [String],required:false},
    imageUrl: { type: String,required:true},
    description: {type:String,required:false},
    rating: {type:Number,required:false},
    category: {type:String, required:true },
    status: {type:String, required:true }
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const ProductModel = model <Product> ('product', ProductSchema)
