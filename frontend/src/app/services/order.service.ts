import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Order } from '../models/order';
import {
  ORDER_CREATE_URL,
  ORDER_DELETE_BY_URL,
  ORDER_EDIT_BY_URL,
  ORDER_GET_MYORDERS,
  ORDER_NEW_FOR_CURRENT_USER_URL,
  ORDER_PASS_IMAGE,
  ORDER_PAY_URL,
  ORDER_URL,
} from '../models/urls';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getAllOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_URL);
  }

  createOrder(order: Order) {
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  pay(order: Order): Observable<string> {
    let formData = new FormData();
    if (order.hasOwnProperty('paymentId')) {
      formData.append('paymentId', order.paymentId);
    } else {
      formData.append('paymentSlip', order.paymentSlip);
    }
    return this.http.put<string>(ORDER_PAY_URL, formData);
  }

  trackOrderById(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_GET_MYORDERS);
  }

  deleteOrder(id: any): Observable<any> {
    console.log('delete')
    return this.http.delete<any>(ORDER_DELETE_BY_URL + id).pipe(tap({
      next:()=>{
        Swal.fire('Order Delete successfully', '', 'success');
      },error:(err)=>{
        Swal.fire('Order Delete Failure', err, 'warning');
      }
    }));
  }



  // Create one more function for just modify image
  saveEditOrder(order: any): Observable<Order> {
    let formData = new FormData
    formData.append("data",JSON.stringify(order))
    if(order.paymentSlip instanceof File)
      console.log('have file')
      formData.append("paymentSlip", order.paymentSlip)
    new Response(formData).text().then(console.log)
    return this.http.put<Order>(ORDER_EDIT_BY_URL, formData);
    //this.passPaymentSlipImage(order.paymentSlip,order.id).subscribe((data)=>console.log(data))
    //return this.http.put<Order>(ORDER_EDIT_BY_URL, order);
  }

  // Since image must user form data.
  // passPaymentSlipImage(paymentSlip:any,id:any): Observable<string>{
  //   let formdata = new FormData
  //   formdata.append("id",id)
  //   formdata.append("paymentSlip",paymentSlip)
  //   return this.http.put<string>(ORDER_PASS_IMAGE,formdata);
  // }
}
