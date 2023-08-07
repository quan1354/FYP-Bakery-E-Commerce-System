import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup
  isSubmitted = false
  returnUrl=''
  constructor(private formBuilder:FormBuilder, private userService:UserService, private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['', [Validators.required]]
    })
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if (this.loginForm.invalid) return
    this.userService.login({email:this.fc.email.value,password:this.fc.password.value}).subscribe(()=>{
      setTimeout(()=>{
        this.router.navigateByUrl(this.returnUrl)
      },1000)
    })
  }
}
