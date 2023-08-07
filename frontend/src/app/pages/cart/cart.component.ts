import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cartItem';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart!:Cart;
  constructor(private cartService:CartService) {
    this.cartService.getCartObservable().subscribe(data=>{
      this.cart = data
    })
  }

  ngOnInit(): void {
  }

  removeFromCart(cartItem:CartItem){
    this.cartService.removeFromCart(cartItem.product.id)
  }

  changeQuantity(cartItem:CartItem, quantityInString:string, control:string){
    let quantity = parseInt(quantityInString);
    control == '' ? quantity = quantity : control == 'up'? quantity++ : quantity--
    if (quantity <1 || isNaN(quantity)) quantity = 1
    this.cartService.changeQuantity(cartItem.product.id, quantity)
  }

  clearCart(){
    this.cartService.clearCart()
  }
}


