import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { LatLng } from 'leaflet';

import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order';
import { CartService } from 'src/app/services/cart.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

type activeTab = 'Delivery' | 'Pick-up';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  isSubmit = false;
  orderForm: FormGroup;
  order: Order = new Order();
  activeTab: activeTab = 'Delivery';
  model: NgbDateStruct = this.calendar.getToday();

  constructor(
    private calendar: NgbCalendar,
    private router:Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    cartService: CartService,
    private toastService: ToastrService,
    private orderService: OrderService
  ) {
    const cart = cartService.getCart();
    this.order.totalPrice = cart.totalPrice;
    this.order.item = cart.items;
    if(this.order.item.length == 0){
      Swal.fire({
        title: 'No item in cart',
        text: "You can't check-out without any item in cart",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/cart')
        }
      })
    }
  }

  ngOnInit(): void {
    let { name, address, email, phone } = this.userService.currentUser;
    this.orderForm = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      phone: [phone, Validators.required],
      receiveOrderDate: [this.model, Validators.required],
      receiveOrdertime: ['10.00am - 12.00pm', Validators.required],
      country:['Malaysia'],
      additionalInfo:['']
    });
  }



  get fc() {
    return this.orderForm.controls;
  }

  createOrder() {
    this.orderService.getNewOrderForCurrentUser().subscribe(data=>{
      if(data==null){
        this.isSubmit = true;
        if(!this.validateForm())return
        this.order.orderName = this.fc.name.value;
        this.order.orderType = this.activeTab;
        if(this.activeTab == 'Delivery'){
          this.order.address = this.fc.address.value;
        }else{
          delete this!.order.addressLatLng
        }
        this.order.phone = this.fc.phone.value;
        this.order.receiveOrdertime = this.fc.receiveOrdertime.value;
        this.order.receiveOrderDate = new Date(this.fc.receiveOrderDate.value.year,this.fc.receiveOrderDate.value.month-1,this.fc.receiveOrderDate.value.day)
        this.order.email = this.fc.email.value;
        this.order.country = this.fc.country.value;
        this.order.additionalInfo = this.fc.additionalInfo.value;
        console.log(this.order)
        this.orderService.createOrder(this.order).subscribe((data)=>{
          console.log(data)
        })
        this.router.navigateByUrl('payment');
      }else{
        Swal.fire({
          title: 'status new of orders exist',
          text: "you want delete or proceed?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Proceed',
          cancelButtonText: 'Delete',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('payment');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.orderService.deleteOrder('all').subscribe()
          }
        })
      }
    })
  }

  validateForm(){
    let isValid = true
    if(this.calendar.getToday().after(this.fc.receiveOrderDate.value)){
      this.toastService.info('Plase select bigger than today date','Receive Date Invalid');
      isValid = false;
    }else if (this.orderForm.invalid) {
      this.toastService.error('Invalid order form', 'There are some field incorrect');
      isValid = false;
    }else if(!this.order.addressLatLng && this.activeTab == 'Delivery'){
      this.toastService.info('Please point a location for delivery method', 'Map location not point')
      isValid = false;
    }else{
      isValid = true
    }
    return isValid
  }

  setActiveTab(type: activeTab) {
    this.activeTab = type;
    if(this.activeTab == 'Pick-up'){
      this.fc.address.removeValidators(Validators.required)
    }else{
      this.fc.address.addValidators(Validators.required)
    }
    this.fc.address.updateValueAndValidity()
    console.log(this.fc.address.hasValidator(Validators.required))
  }
}
