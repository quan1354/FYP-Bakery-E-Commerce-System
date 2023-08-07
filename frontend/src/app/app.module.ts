import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
// import { AgmCoreModule } from '@agm/core';
// import { FakeAPIService } from './_fake/fake-api.service';
// #fake-end#
import {ModalsModule} from './_metronic/partials';
import { ContactComponent } from './pages/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputValidationComponent } from './pages/partial/input-validation/input-validation.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { AboutComponent } from './pages/about/about.component';
import { ShopComponent } from './pages/shop/shop.component';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FormsModule } from '@angular/forms'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { AuthInterceptor } from './guard/auth.interceptor';
// import { NgImageSliderModule } from 'ng-image-slider';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/partial/not-found/not-found.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductComponent } from './pages/admin/product/product.component';
import { AddProductComponent } from './pages/admin/product/add-product/add-product.component';
import { OrderComponent } from './pages/admin/order/order.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { MyOrderComponent } from './pages/my-order/my-order.component';
import { MapComponent } from './pages/partial/map/map.component';
import { PaypalComponent } from './pages/partial/paypal/paypal.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LoadingComponent } from './pages/partial/loading/loading.component';
import { LoadingInterceptor } from './guard/loading.interceptor';
import { ProfileComponent } from './pages/profile/profile.component';
import { CustomerComponent } from './pages/admin/customer/customer.component';

@NgModule({
  declarations: [AppComponent, ContactComponent, ProductComponent, InputValidationComponent, AboutComponent, ShopComponent, CheckoutComponent, HomeComponent, NotFoundComponent, CartComponent, AddProductComponent, OrderComponent, PaymentComponent, MyOrderComponent, MapComponent, PaypalComponent, LoadingComponent, ProfileComponent, CustomerComponent],
  imports: [
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    }),
    ModalsModule,
    // NgImageSliderModule,
    // CarouselModule,
    //ModalsModule,
    NgxDropzoneModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserModule,
    ReactiveFormsModule,
    MatDialogModule,
    //ModalsModule,
    // WidgetsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    // #fake-start#
    // environment.isMockEnabled
    //   ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
    //       passThruUnknownUrl: true,
    //       dataEncapsulation: false,
    //     })
    //   : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
