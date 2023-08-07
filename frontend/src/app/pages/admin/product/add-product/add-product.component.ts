import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  category: any[] = [];
  newCategoryName:string
  isAddCategory:boolean;
  closeResult = '';
  isSubmit = false;
  imageURL:BehaviorSubject<string> = new BehaviorSubject('assets/media/svg/files/blank-image.svg');
  tags: string[] = [];

  constructor(private router:Router, public productService:ProductService, private toastService:ToastrService) {
    this.productService.getAllTags().subscribe(category=>{
      this.category = category
    })
    //this.productService.form.value.tags != '' && this.productService.form.value.tags != null
    if(this.productService.formType == 'Save'){
      console.log("Have Tags :o")
      this.imageURL.next(this.productService.form.value.image as string)
      this.tags = this.productService.form.value.tags
    }
  }

  ngOnInit(): void {
  }

  //handle tags
  tagController(type:string,value:any) {
    if (type == 'insert') {
      this.tags.push(value);
      this.productService.form.patchValue({tags: this.tags})
    } else if (type == 'delete') {
      this.tags = this.tags.filter((data) => data !== value);
    }
  }

  //handle image
  showPreview(event: any) {
    const file = event.target.files[0];
    this.productService.form.patchValue({
      image: file,
    });
    this.fc.image.updateValueAndValidity();
    const allowFileType = ['image/png','image/jpg','image/jpeg']
    if(file && allowFileType.includes(file.type)){
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL.next(reader.result as string)
      };
      reader.readAsDataURL(file);
    }
  }

  //submit form
  submit() {
    this.isSubmit = true;
    if (this.checkFormValid() == false) return
    this.fc.tags.setValue(this.tags)
    console.log(this.productService.form.value)
    if (this.productService.formType == 'Create') {
      console.log('add:')
      this.productService.createProduct(this.productService.form.value).subscribe(data=>{
        console.log(data)
    })
    }else if(this.productService.formType == 'Save') {
      console.log('update:')
      this.productService.updateProduct(this.productService.form.value).subscribe(data=>{
        console.log(data)
    })
    }
    this.router.navigateByUrl('admin-product')
  }

  isNewCategory(event:any){
    if(event.target.checked){
      this.isAddCategory = true;
    }else{
      this.isAddCategory = false;
    }
  }

  get fc() {
    return this.productService.form.controls;
  }

  checkFormValid():Boolean{
    if(this.productService.form.invalid){
      this.toastService.error('Require fields empty', 'Plase fill in red highlight fields')
      return false
    }
    if(this.fc.stockQuantity.value != null && this.fc.stockQuantity.value != ''){
      if(Number.isInteger(this.fc.stockQuantity.value) == false || Number(this.fc.stockQuantity.value) <= 0){
        this.toastService.error('Stock value must be Integer and not less than 0', 'Stock value invalid')
        return false
      }
    }
    if(isNaN(parseFloat(this.fc.price.value))|| Number(this.fc.price.value) <= 0){
      this.toastService.error('Price value must be number and not less than 0', 'Price value invalid')
      return false
    }
    return true
  }
}
