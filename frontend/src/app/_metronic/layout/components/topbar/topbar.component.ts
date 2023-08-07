import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  user!:User;
  imgPreview:string

  cartQuantity = 0

  constructor(private layout: LayoutService, private cartService:CartService, private userService:UserService) {
    cartService.getCartObservable().subscribe(data=>{
      this.cartQuantity = data.totalCount
    })
    userService.userObservable.subscribe(newUser=>{
      this.user = newUser
      if(!newUser.avatar){
        this.imgPreview = '../../../assets/media/icons/duotune/communication/com006.svg'
      }else{
        this.imgPreview = newUser.avatar
      }
    })
  }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
  }

  get isAuth(){
    return this.user.token
  }
}
