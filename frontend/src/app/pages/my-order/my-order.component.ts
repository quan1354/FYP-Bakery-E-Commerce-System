import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  order:Observable<Order[]>

  constructor(private activatedRoute:ActivatedRoute, private orderService:OrderService, private modalService: NgbModal) {
    this.order  = this.orderService.trackOrderById()
    this.order.subscribe(data=>{
      console.log(data)
    })
  }

  ngOnInit(): void {
  }

  onFilter(event:any){
    let value = event.target.value
    this.order = this.orderService.getAllOrder()
    if(value != 'all')
    this.order = this.order.pipe(map(orders => orders.filter(order => order.status == value)))
  }

  showOrderDetail(content:any){
    this.modalService.open(content, { centered: true, size:'lg'});
  }

}
