import { Component, OnInit, ViewChild } from '@angular/core';
//import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import {
  tap,
  Subject,
  map,
  Observable,
  from,
  toArray,
  mergeMap,
  ignoreElements,
} from 'rxjs';
import { Category } from 'src/app/models/tag';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
type breadType = 'half' | 'whole' | 'gram550' | 'gram180' | 'normal';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [NgbRatingConfig],
})
export class ShopComponent implements OnInit {
  rateNum: number = 0;
  activeBreadType: breadType;
  closeResult = '';
  searchTerm = '';
  category: Observable<Category[]>;
  products = new Observable<Product[]>();
  productIsEmpty = false;
  LoafPrice: any = 'Select Type';
  similarProduct: any[] = [];
  pointerProduct: Product;
  pointerUser: User;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private modalService: NgbModal,
    private starconfig: NgbRatingConfig,
    private userService: UserService,
    private toastservice: ToastrService
  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.searchTerm) {
        this.products = this.productService.getAllProductBySearchTerm(
          params.searchTerm
        );
      } else if (params.category) {
        this.products = this.productService.getProductByCategoty(
          params.category
        );
      } else {
        this.products = this.productService
          .getAllProduct()
          .pipe(
            map((product) =>
              product.filter((prod) => prod.status !== 'inactive')
            )
          );
      }
      this.products.subscribe((data) => {
        data.length <= 0
          ? (this.productIsEmpty = true)
          : (this.productIsEmpty = false);
      });
      this.category = this.productService.getAllTags();
    });
    this.starconfig.max = 5;
    console.log(this.products);
  }

  ngOnInit(): void {}

  search(query: string) {
    if (query == '') {
      this.products = this.productService.getAllProduct();
      this.productIsEmpty = false;
    } else {
      this.router.navigateByUrl('/search/' + query);
    }
  }

  setBreadType(type: breadType) {
    this.activeBreadType = type;
  }

  onFilter(event: any) {
    if (event.target.value == 'ascending') {
      this.products = this.products.pipe(
        map((data) => {
          data.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          });
          return data;
        })
      );
    } else if (event.target.value == 'descending') {
      this.products = this.products.pipe(
        map((data) => {
          data.sort((a, b) => {
            return a.name > b.name ? -1 : 1;
          });
          return data;
        })
      );
    } else {
      this.products = this.productService.getAllProduct();
    }
  }

  addToCart(product: Product, quantity: string) {
    let qty = parseInt(quantity);
    if (product.status == 'out-stock') {
      this.toastservice.error(
        "out-stock product can't add to cart",
        'Product out stock'
      );
      return;
    }
    this.cartService.addToCart(product, qty);
  }

  // productExist(arrObject:any, id:string){
  //   return arrObject.some(function(el:any) {
  //     return el.id === id;
  //   });
  // }
  // if(this.preference.some((obj:any) => obj.product === prodId)){
  //   console.log('have')
  // }
  changeRate() {
    if (this.rateNum != 0) {
      this.userService.updatePreference(
        this.pointerUser.id,
        this.pointerProduct.id,
        this.rateNum
      );
    }
  }

async open(content: any, pointProd: any) {
    this.productService.getProductId(pointProd.id).subscribe(data=>{
      this.rateNum = data.rating ? data.rating : 0;
    })
    this.pointerProduct = pointProd
    this.pointerUser = this.userService.currentUser
    this.productService.getAllProduct().subscribe((products) => {
      let placer = products;
      let temObj = {
        product: placer,
        name: pointProd.name,
        category: pointProd.category,
      };
      this.productService.similarProduct(temObj).subscribe((suggestion) => {
        for (let i = 0; i < suggestion['similar'].length; i++) {
          this.similarProduct.push(products[suggestion['similar'][i]]);
        }
      });
    });

    // this.userService.getUserById(this.userService.currentUser.id).subscribe((data) => {
    //     let result = data.preference.find((obj: any) => obj.product === pointProd.id);
    //     this.rateNum = result ? result.rating : 0;
    //     this.pointerUser = data;
    // });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.calculateRating()
          this.similarProduct = [];
          this.products = this.productService.getAllProduct()
        }
      );
  }

  calculateRating(){
    this.userService.getAllUser().subscribe(data=>{
      let users = data.filter(users => users.preference.find((obj: any) =>  obj.product === this.pointerProduct.id))
      let rating:any = {
        1:0,
        2:0,
        3:0,
        4:0,
        5:0
      }
      for(let i=0; i< users.length; i++){
        let placer = users[i].preference.find((obj: any) =>  obj.product === this.pointerProduct.id)
        rating[placer.rating]++
      }
      let prodRating = Math.round((5*rating[5] + 4*rating[4] + 3*rating[3] + 2*rating[2]+ 1*rating[1])/ (rating[5]+rating[4]+rating[3]+rating[2]+rating[1]))
      console.log(prodRating)
      this.productService.updateProductRating(prodRating,this.pointerProduct.id).subscribe(data=>{console.log(data)})

    })
  }

  close(content: any, product: any) {
    this.modalService.dismissAll();
    this.similarProduct = [];
    this.open(content, product);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
