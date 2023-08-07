import { LatLng } from "leaflet";
import { CartItem } from "./cartItem";

export class Order{
  id:string;
  item:CartItem[];
  totalPrice:number;
  orderName:string;
  orderType:string;
  address:string;
  addressLatLng?:LatLng;
  paymentId:string;
  createdAt:string;
  status:string;
  paymentSlip:any;
  receiveOrdertime: string;
  receiveOrderDate: Date;
  phone:string;
  email:string;
  country:string;
  additionalInfo:string;
  user:string
}
