import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/tag';
import Swal from 'sweetalert2';
import {
  PRODUCT_BY_ID_URL,
  PRODUCT_BY_SEARCH_URL,
  PRODUCT_BY_TAG_CATEGORY,
  PRODUCT_CREATE_URL,
  PRODUCT_DELETE_BY_ID,
  PRODUCT_TAGS_CATEGORY,
  PRODUCT_UPDATE_RATING,
  PRODUCT_UPDATE_URL,
  PRODUCT_URL,
} from '../models/urls';
interface Price{
  type:string,
  priceValue:number,
  stockQuantity:number
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public formType: string;
  constructor(private http: HttpClient, private fb: FormBuilder) {}

  // product form, place here to control clean and assign value to form
  form: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    price: ['', Validators.required],
    status: ['', Validators.required],
    category: ['', Validators.required],
    description: [''],
    stockQuantity: [''],
    image: [null, Validators.required],
    tags: [[]],
  });

  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCT_URL);
  }

  getAllTags(): Observable<Category[]> {
    return this.http.get<Category[]>(PRODUCT_TAGS_CATEGORY);
  }

  getAllProductBySearchTerm(searchTerm: string) {
    return this.http.get<Product[]>(PRODUCT_BY_SEARCH_URL + searchTerm);
  }

  getProductByCategoty(category: string): Observable<Product[]> {
    return category == 'All'
      ? this.getAllProduct()
      : this.http.get<Product[]>(PRODUCT_BY_TAG_CATEGORY + category);
  }

  getProductId(productId: string): Observable<Product> {
    return this.http.get<Product>(PRODUCT_BY_ID_URL + productId);
  }

  createProduct(product: any): Observable<Product> {
    console.log(product);
    let formData = this.makeFormData(product);
    return this.http.post<Product>(PRODUCT_CREATE_URL, formData).pipe(
      tap({
        next: () => {
          Swal.fire('Product Created successfully', '', 'success');
        },
        error: (err) => {
          console.log(err)
          Swal.fire('Product Created Failure', err.error, 'warning');
        },
      })
    );
  }

  updateProductRating(prodRating:Number,id:any){
    //var formData = new FormData();
    //formData.append("data", JSON.stringify({id:id,rating:prodRating}))
    //new Response(formData).text().then(console.log)
    let rating = {id:id,rating:prodRating}
    return this.http.put<Product>(PRODUCT_UPDATE_RATING,rating)
  }

  updateProduct(product: any): Observable<Product> {
    console.log(product)
    let formData = this.makeFormData(product);
    formData.append('id', product.id);
    return this.http.put<Product>(PRODUCT_UPDATE_URL, formData).pipe(
      tap({
        next: () => {
          Swal.fire('Product Update successfully', '', 'success');
        },
        error: (err) => {
          Swal.fire('Product Update Failure', err.error.message, 'warning');
        },
      })
    );
  }



  deleteProductById(productId: any): Observable<Product> {
    return this.http.delete<Product>(PRODUCT_DELETE_BY_ID + productId).pipe(
      tap({
        next: () => {
          Swal.fire('Product Delete successfully', '', 'success');
        },
        error: (err) => {
          console.log(err)
          Swal.fire('Product Delete Failure', err.error.message, 'warning');
        },
      })
    );
  }

  recommend(data:any){
    return this.http.post<any>('http://127.0.0.1:5002/recommend', data)
  }

  similarProduct(data:any){
    return this.http.post<any>('http://127.0.0.1:5002/similarProd', data)
  }

  makeFormData(product: any) {
    let formData = new FormData();
    formData.append('id',product.id)
    formData.append('name', product.name)
    formData.append('image', product.image)
    formData.append('category', product.category)
    formData.append('status', product.status)
    formData.append('type','normal')
    formData.append('price',product.price)//
    for (let i = 0; i < product.tags.length; i++) {
      formData.append('tag[]',  product.tags[i]);
    }

    if(product.stockQuantity!=null){
      formData.append('stockQuantity', product.stockQuantity)
    }
    if(product.description!=null){
      formData.append('description', product.description)
    }
    return formData;
  }


}
