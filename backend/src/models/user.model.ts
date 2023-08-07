import { Schema, model} from "mongoose";

export interface Preference{
    product:string,
    rating:number
}

export const PreferenceSchema = new Schema <Preference> ({
    product:{type:String, required:true},
    rating:{type:Number, required:true}
})

export interface User{
    id:string;
    email:string;
    phone:string;
    password:string;
    name:string;
    address:string;
    isAdmin:boolean;
    avatar:string;
    country: string;
    preference: Preference[];
}

export const UserSchema = new Schema <User> ({
    email:{type:String, required:true},
    name: {type:String, required:true, unique:true},
    phone:{type:String, required:false},
    password: {type:String, required: true},
    address: {type:String, required:false},
    isAdmin: {type:Boolean, required:true},
    avatar:{type:String, required:false},
    country: {type:String, required:false},
    preference: {type:[PreferenceSchema], required:false}
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const UserModel = model <User> ('user',UserSchema)

  