import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig, ModalComponent,ModalsModule  } from '../../_metronic/partials';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { Product } from 'src/app/models/product';
// import { NgImageSliderComponent } from 'ng-image-slider';
type Tabs = 'recomendation' | 'top-category' | 'top-rate';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  @ViewChild('modal') private modalComponent: ModalComponent;
  // @ViewChild('nav') slider: NgImageSliderComponent;
  activeTab: Tabs = 'top-rate';
  modalConfig: ModalConfig = {
    dismissButtonLabel: 'Close',
    hideCloseButton(){return true}
  };
  images = [
    'http://localhost:5000/uploads/bakery4.jpg',
    'http://localhost:5000/uploads/bakery5.jpg',
    'http://localhost:5000/uploads/bakery6.jpg',
  ];
  recommendData:any={
    recommend:[],
    favourite:[],
    topRate:[]
  }

  constructor(
    config: NgbCarouselConfig,
    private productService: ProductService,
    private userService: UserService
  ) {
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
    this.recomemendProd();
  }

  ngOnInit(): void {}

  setActiveTab(type: Tabs) {
    this.activeTab = type;
  }

  async openModal(product:any) {
    this.modalConfig.modalTitle = product.name
    return await this.modalComponent.open(product);
  }

  recomemendProd() {
    let userData:object[] = []
    let id = 0
    let countIndex = 1
    this.productService.getAllProduct().subscribe((products) => {
      this.userService.getAllUser().subscribe((users) => {
        console.log(users)
          let productData = products.map((item) => {
            return {
              breadId:item.id,
              imageUrl:item.imageUrl,
              name: item.name,
              category : item.category,
              tag:item.tag.join()
            }
          })

          for(let i=0;i<users.length;i++){
            if (users[i].preference.length !=0){
              users[i].id == this.userService.currentUser.id? id = countIndex : 0
              for(let j=0;j<users[i].preference.length;j++){
                let holder = users[i].preference[Object.keys(users[i].preference)[j]]
                let tmpObj = {userId:countIndex, breadId:holder.product, rating:holder.rating}
                userData.push(tmpObj)
              }
              countIndex++
            }
          }
          let overallData = {
            currentUser : id,
            product: productData,
            user: userData
          }
          console.log(overallData)
          this.productService.recommend(overallData).subscribe(data=>{
            console.log(data)
            this.initialRecommend(data,overallData['product'],'recommend')
            this.initialRecommend(data,overallData['product'],'topRate')
            this.initialRecommend(data,overallData['product'],'favourite')
            console.log(this.recommendData)
          })
        });
    });

    // prevImageClick() {
    //   this.slider.prev();
    // }

    // nextImageClick() {
    //   this.slider.next();
    // }
  }

  initialRecommend(data:any,prodData:any,type:string){
    for(let i = 0; i < data[type].length;i++){
      this.recommendData[type].push(prodData[data[type][i]])
    }
  }

}
