import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { AboutComponent } from './about/about.component';
import { CustomerComponent } from './admin/customer/customer.component';
import { OrderComponent } from './admin/order/order.component';
import { AddProductComponent } from './admin/product/add-product/add-product.component';
import { ProductComponent } from './admin/product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
// import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
// import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';

const Routing: Routes = [
  {path: 'about', component: AboutComponent },
  {path: 'contact', component: ContactComponent},
  { path: 'check-out', component:CheckoutComponent, canActivate:[AuthGuard]},
  { path: 'cart', component:CartComponent},
  { path: 'home', component:HomeComponent},
  { path: 'shop', component:ShopComponent},
  { path: 'payment', component:PaymentComponent, canActivate:[AuthGuard]},
  { path: 'myOrder/:id', component:MyOrderComponent, canActivate:[AuthGuard]},
  { path: 'myOrder', component:MyOrderComponent, canActivate:[AuthGuard]},
  { path: 'category/:cat', component:ShopComponent},
  { path: 'search/:searchTerm', component:ShopComponent},
  { path: 'user-profile/:userId', component:ProfileComponent, canActivate:[AuthGuard]},
  {
    path: 'admin-product',
    children: [
      {
        path:'', component: ProductComponent
      },
      {
        path: 'add-product', component:AddProductComponent
      }
    ]
  },
  {path:'admin-order',component: OrderComponent},
  {path:'admin-customer',component: CustomerComponent},
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
