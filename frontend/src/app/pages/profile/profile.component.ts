import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User
  profileMode: string = 'Edit Profile';
  avatarPreview: BehaviorSubject<string> = new BehaviorSubject('http://localhost:5000/uploads/com006.svg');
  userID: string;
  canUpload:boolean = true
  isAdmin:boolean

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private activartedRoute: ActivatedRoute,
    private toastService:ToastrService
  ) {
    this.activartedRoute.params.subscribe((params: any) => {
      this.userID = params.userId;
    });
    this.isAdmin = this.userService.currentUser.isAdmin
    this.profileForm = this.fb.group({
      avatar: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isAdmin:[false, Validators.required]
    });

    this.userService.getUserById(this.userID).subscribe((user) => {
      console.log(user)
      this.user = user;
      if(user.avatar){
        this.avatarPreview.next(user.avatar)
      }
      console.log(this.avatarPreview.value)
      this.profileForm.patchValue({
        avatar: user.avatar ? user.avatar : this.avatarPreview.value,
        name: user.name ? user.name: '',
        isAdmin: user.isAdmin ? user.isAdmin : false,
        email: user.email ? user.email : '',
        phone: user.phone ? user.phone : '',
        country: user.country ? user.country : '',
        address: user.address ? user.address : '',
        password: user.password ? user.password : '',
      });
    });

    this.profileForm.disable();
  }

  ngOnInit(): void {

  }

  get fc() {
    return this.profileForm.controls;
  }

  showPreview(event: any) {
    const file = event.target.files[0];
    this.profileForm.patchValue({
      avatar: file,
    });
    this.fc.avatar.updateValueAndValidity();
    const allowFileType = ['image/png', 'image/jpg', 'image/jpeg'];
    if (file && allowFileType.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview.next(reader.result as string)
      };
      reader.readAsDataURL(file);
    }
  }

  editProfile() {
    this.toastService.info('Edit Mode Activated','You can edit profile now')
    this.profileForm.enable();
    this.canUpload = false
    this.profileMode = 'Save Change';
  }

  saveProfile() {
    let id = this.user.id;
    this.userService.updateUser(id, this.profileForm.value).subscribe(data=>{
      console.log(data)
      this.profileForm.disable();
      this.canUpload = true
      this.profileMode = 'Edit Profile';
    })
  }
}
