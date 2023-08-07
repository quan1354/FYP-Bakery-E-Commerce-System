import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

type paymentType = 'paypal' | 'card' | 'photo'
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSlip: any;
  showImageSlip:BehaviorSubject<string> = new BehaviorSubject('assets/media/svg/files/blank-image.svg');
  activePayType:paymentType = 'paypal'
  order: Order = new Order();
  orderObservable:Observable<Order>
  constructor(private orderService: OrderService, private router: Router,private cartService:CartService) {
    this.orderObservable = this.orderService.getNewOrderForCurrentUser()
    this.orderObservable.subscribe(data=>{
      if(data==null){
        Swal.fire({
          title: 'You havent made any order',
          text: "can't proceed to payment without make an order",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes'
        }).then((result) => {
          this.router.navigateByUrl('/shop')
        })
      }else{
        this.order = data
      }
    })
  }

  ngOnInit(): void {}

  uploadImage(event:any){
    const file = event.target.files[0]
    const allowFileType = ['image/png','image/jpg','image/jpeg']
    if(file && allowFileType.includes(file.type)){
      this.paymentSlip = file;
      const reader = new FileReader();
        reader.onload = () => {
          this.showImageSlip.next(reader.result as string)
        };
        reader.readAsDataURL(file);
    }else{
      Swal.fire('Error File format', 'only accept png,jpg,jpeg', 'error')
    }
  }

  makePayment(){
    if (this.activePayType == 'photo' && this.paymentSlip instanceof File == false){
      Swal.fire('Error','Please upload your payment slip','warning')
      return
    }
    this.order.paymentSlip = this.paymentSlip
    this.orderService.pay(this.order).subscribe({
        next:()=>{
          this.cartService.clearCart();
          this.router.navigateByUrl('myOrder')
        },error:(error)=>{
          Swal.fire(
            'Error',
            error,
            'warning'
          )
        }
      })
  }

  setActivePayTab(payType:paymentType){
    this.activePayType = payType;
  }
}
