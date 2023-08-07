import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  product:Product
  products:Observable<Product[]>
  constructor(public productService:ProductService,private config: NgbRatingConfig) {
    this.config.max = 5
    this.config.readonly = true
    this.products = this.productService.getAllProduct()
    this.products.subscribe(data=>{
      console.log(data)
    })
  }

  ngOnInit(): void {

  }

  //search name match
  searchProduct(event:string){
    if (event == '')
    this.products = this.productService.getAllProduct()
    else
    this.products = this.productService.getAllProductBySearchTerm(event)
  }

  //delete product
  deleteProduct(product:Product){
    Swal.fire({
      title: 'Are you sure to delete Product ?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProductById(product.id).subscribe((data)=>{
          console.log(data)
          this.refreshTable()
        })
      }
    })

  }

  // clear product form value
  clearProductForm(){
    this.productService.form.reset()
    this.productService.formType = 'Create'

  }

  // assign values into product form
  modifyProduct(prod:Product){
    this.productService.form.patchValue({
      id:prod.id,
      name:prod.name,
      price: prod.price.priceValue,
      tags: prod.tag,
      description: prod.description,
      status: prod.status,
      image: prod.imageUrl,
      category: prod.category,
      rating:prod.rating,
      stockQuantity:prod.price.stockQuantity
    })
    this.productService.formType = 'Save'
  }

  onFilter(event:any){
    let value = event.target.value
    console.log(value)
    this.products = this.productService.getAllProduct()
    if(value != 'all') this.products = this.products.pipe(map(products => products.filter(prod => prod.status === value)))
  }

  refreshTable(){
    this.products = this.productService.getAllProduct()
  }
}
