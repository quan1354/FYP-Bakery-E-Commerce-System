import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  resetPwdForm: FormGroup
  isSubmitted = false;
  constructor(private fb:FormBuilder, private userService:UserService, private router:Router) {
    this.resetPwdForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
  }

  get fc (){
    return this.resetPwdForm.controls
  }

  submit(){
    this.isSubmitted = true;
    if(this.resetPwdForm.invalid) return

    const resetPassword = {
      email:this.fc.email.value,
      password:this.fc.password.value
    }
    console.log(resetPassword)
    this.userService.resetPassword(resetPassword).subscribe(()=>{
      setTimeout(()=>{
        this.router.navigateByUrl('/auth/login')
      },2000)
    })


  }

}
