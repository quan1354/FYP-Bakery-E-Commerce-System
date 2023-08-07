import { AbstractControl } from "@angular/forms";

export class User{
  id:string;
  avatar:string;
  email:string;
  phone:string;
  password:string;
  name:string;
  country: string;
  address:string;
  token:string;
  preference:any;
  isAdmin:boolean;
}

//login input of pattern
export interface IUserLogin {
  email: string;
  password: string;
}

//register input of pattern
export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}
