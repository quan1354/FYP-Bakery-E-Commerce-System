import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserRegister } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

const PasswordsMatchValidator = (
  passwordControlName: string,
  confirmPasswordControlName: string
) => {
  const validator = (form: AbstractControl) => {
    const passwordControl = form.get(passwordControlName);
    const confirmPasswordControl = form.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) return;

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ notMatch: true });
    } else {
      const errors = confirmPasswordControl.errors;
      if (!errors) return;

      delete errors.notMatch;
      confirmPasswordControl.setErrors(errors);
    }
  };
  return validator;
};


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '';
  constructor(private fb:FormBuilder, private router:Router,private activatedRoute: ActivatedRoute,private userService:UserService) {


  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      confirmPassword:['',[Validators.required, Validators.minLength(6)]],
      agree:[false,Validators.requiredTrue]
    },{
      validator:PasswordsMatchValidator('password','confirmPassword')
    })
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc(){
    return this.registerForm.controls
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return

    const fv = this.registerForm.value
    const user:IUserRegister = {
      name: fv.name,
      email:fv.email,
      password:fv.confirmPassword
    }
    console.log(user)
    this.userService.register(user).subscribe(()=>{
      setTimeout(()=>{
        this.router.navigateByUrl(this.returnUrl)
      },2000)
    })
  }
}
