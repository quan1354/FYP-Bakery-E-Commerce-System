import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { InputValidationComponent } from '../partial/input-validation/input-validation.component';


@NgModule({
  declarations: [
    //InputValidationComponent,
    AuthComponent,
    LoginComponent,
    RegistrationComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
