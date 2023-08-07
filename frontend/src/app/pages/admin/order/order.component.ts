import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import {formatDate} from '@angular/common';
import { NgbDateStruct, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order:Order
  orders:Observable<Order[]>
  orderForm:FormGroup
  modal: NgbDateStruct
  imageURL:any
  isSubmit = false;

  constructor(private router:Router, private orderService:OrderService,private calendar: NgbCalendar, private modalService:NgbModal, private fb:FormBuilder,@Inject(LOCALE_ID) private locale: string, private toastService:ToastrService) {
    // render order data
    this.orders = orderService.getAllOrder()

    // this.orders.pipe(map(order=>{
    //   for(let pointOrder of order){
    //     let id = pointOrder.id.toString()
    //     let ObjTimestamp = parseInt(id.substring(0, 8),16).toString().slice(-5);
    //     let Counter = parseInt(id.slice(-6),16);
    //     pointOrder.id = base62.encode(parseInt(Counter) + parseInt(ObjTimestamp))
    //   }
    // }))
    // my order Form (edit)
    this.orderForm = this.fb.group({
      id:[''],
      orderName:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      country:['', Validators.required],
      phone:['', Validators.required],
      totalPrice:['', Validators.required],//
      orderType:['', Validators.required],
      status:['', Validators.required],
      receiveOrdertime:['', Validators.required],
      receiveOrderDate:[this.modal, Validators.required],//
      createdAt:[''],//
      additionalInfo:[''],
      address:[''],
      addressLatLng:[''],
      paymentId:[''],
      paymentSlip:[null]
    })
  }

  ngOnInit(): void {
  }


  // assign value into form
  showOrderDetail(content:any, order:Order){
    console.log(order)
    this.modalService.open(content, { centered: true, size:'lg'});
    this.order = order
    this.imageURL = order.paymentSlip
    let datePlacer = new Date(this.order.receiveOrderDate)
    this.orderForm.patchValue({
      id:order.id,
      orderName: order.orderName,
      email: order.email,
      country:order.country,
      phone:order.phone,
      totalPrice:order.totalPrice,
      orderType:order.orderType,
      status:order.status,
      receiveOrdertime:order.receiveOrdertime,
      receiveOrderDate:{year:datePlacer.getFullYear(), month:datePlacer.getMonth(), day:datePlacer.getDate()},
      createdAt:formatDate(order.createdAt,'dd-MMM-YYYY HH:mm:ss',this.locale),
      additionalInfo:order.additionalInfo,
      address:order.address,
      addressLatLng:order.addressLatLng,
      paymentId:order.paymentId,
      paymentSlip:order.paymentSlip
    })
  }

  // handle image change
  previewImage(event:any){
    const file = event.target.files[0]
    this.orderForm.patchValue({paymentSlip:file})
    this.fc.paymentSlip.updateValueAndValidity();
    const allowFileType = ['image/png','image/jpg','image/jpeg']
    if(file && allowFileType.includes(file.type)){
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  checkFormValid(){
    if(this.orderForm.invalid){
      this.toastService.error('Require fields empty', 'Please fill in red highlight fields')
      return false
    }
    if(isNaN(parseFloat(this.fc.totalPrice.value))|| Number(this.fc.totalPrice.value) <= 0){
      this.toastService.error('Price value must be number and not less than 0', 'Price value invalid')
      return false
    }
    return true
  }

  // send value after edit
  saveOrder(){
    this.isSubmit = true;
    if(this.checkFormValid()==false)return
    this.modalService.dismissAll('done edit order')
    // item:CartItem[];
    this.order.id = this.fc.id.value
    this.order.totalPrice = this.fc.totalPrice.value
    this.order.orderName = this.fc.orderName.value
    this.order.orderType = this.fc.orderType.value
    this.order.address = this.fc.address.value
    this.order.addressLatLng = this.fc.addressLatLng.value
    this.order.paymentId = this.fc.paymentId.value
    this.order.createdAt = this.fc.createdAt.value
    this.order.paymentSlip = this.fc.paymentSlip.value
    this.order.receiveOrdertime = this.fc.receiveOrdertime.value
    this.order.receiveOrderDate = new Date(this.fc.receiveOrderDate.value.year,this.fc.receiveOrderDate.value.month-1,this.fc.receiveOrderDate.value.day)
    this.order.phone = this.fc.phone.value
    this.order.email = this.fc.email.value
    this.order.country = this.fc.country.value
    this.order.status = this.fc.status.value
    this.order.additionalInfo = this.fc.additionalInfo.value
    console.log(this.order)
    this.orderService.saveEditOrder(this.order).subscribe(data=>{
      console.log(data)
      this.orders = this.orderService.getAllOrder()
    })
  }

  // get form controls
  get fc (){
    return this.orderForm.controls
  }

  // delete Order
  deleteOrder(orderId:any){
    Swal.fire({
      title: 'Are you sure to delete order ?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(orderId).subscribe(data=>{
          console.log(data)
          this.refreshTable()
        })
      }
    })
  }

  viewUserProfile(user:any){
    console.log(user)
    this.router.navigateByUrl('/user-profile/' + user)
  }

  refreshTable(){
    this.orders = this.orderService.getAllOrder()
  }

  onFilter(event:any){
    let value = event.target.value
    this.orders = this.orderService.getAllOrder()
    if(value != 'all')
    this.orders = this.orders.pipe(map(orders => orders.filter(order => order.status == value)))
  }

  searchOrder(value:string){
    if(value == ''){
      this.orders = this.orderService.getAllOrder()
    }else{
      this.orders = this.orders.pipe(map(orders => orders.filter(order => order.id.includes(value) || order.orderType.toLowerCase().includes(value.toLowerCase()) || order.orderName.toLowerCase().includes(value.toLowerCase())||order.createdAt.includes(value))))
    }
  }
}
