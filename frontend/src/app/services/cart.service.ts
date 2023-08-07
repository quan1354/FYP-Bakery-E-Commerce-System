import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart:Cart = this.getCartFromLocalStorage();
  private cartSubject:BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor(private toastr: ToastrService) { }

  addToCart(product:Product,quantity:number){
    let cartItem = this.cart.items.find(item => item.product.id === product.id)
    if (cartItem){
      this.toastr.info('Item Already Exist in your Cart');
      return
    }
    this.cart.items.push(new CartItem(product,quantity))
    this.setCartToLocalStorage();
  }

  removeFromCart(productId:string){
    this.cart.items = this.cart.items.filter(item => item.product.id != productId)
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId:string, quantity:number){
    let cartItem = this.cart.items.find(item => item.product.id === foodId);
    if(!cartItem) return;
    cartItem.quantity = quantity;
    cartItem.itemPrice = quantity * cartItem.product.price.priceValue;
    this.setCartToLocalStorage();
  }

  clearCart(){
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable():Observable<Cart>{
    return this.cartSubject.asObservable();
  }

  getCart():Cart{
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(){
    this.cart.totalPrice = this.cart.items
    .reduce((pre,current)=> pre + current.itemPrice,0)
    this.cart.totalCount = this.cart.items
    .reduce((pre,current)=>pre+current.quantity,0)

    const cartJson = JSON.stringify(this.cart)
    localStorage.setItem('Cart',cartJson)
    this.cartSubject.next(this.cart)
  }

  private getCartFromLocalStorage(){
    const cartJson = localStorage.getItem('Cart')
    return cartJson? JSON.parse(cartJson): new Cart()
  }
}
