export class Product{
  id:string;
  name:string;
  price:any;
  tag:string[];
  imageUrl: string;
  description: string;
  rating:number;
  category: string;
  status: string;
}

export interface IUProduct{
    name:string;
    price:any;
    tag:string[];
    imageUrl: string;
    description: string;
    rating:number;
    category: string;
    status: string;
}

