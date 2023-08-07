import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { USER_DELETE, USER_GET_BY_ID, USER_LOGIN_URL, USER_REGISTER_URL, USER_RESET_PASSWORD, USER_UPDATE_PREFERENCE, USER_UPDATE_URL, USER_URL } from '../models/urls';
import { IUserLogin, IUserRegister, User } from '../models/user';
const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private UserSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  public userObservable: Observable<User>;
  constructor(private http: HttpClient, private toastService: ToastrService) {
    this.userObservable = this.UserSubject.asObservable();
  }

  public get currentUser():User{
    return this.UserSubject.value
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.UserSubject.next(user);
          this.toastService.success(
            `Welcome to LEPAN ${user.name}`,
            'Login Successful'
          );
        },
        error: (err) => {
          this.toastService.error(err.error, 'Login Failure');
        },
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.UserSubject.next(user);
          this.toastService.success(
            `Welcome to LEPAN ${user.name}`,
            'Register Success'
          );
        },
        error: (err) => {
          this.toastService.error(err.error, 'Register Failure');
        },
      })
    );
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage() {
    const userJSON = localStorage.getItem(USER_KEY);
    if (userJSON) return JSON.parse(userJSON) as User;
    return new User();
  }

  resetPassword(password:any):Observable<any>{
    return this.http.post(USER_RESET_PASSWORD,password).pipe(tap({
      next:()=>{
        this.toastService.success(
          `${password.email} of password has been reset`,
          'Reset Password Successful'
        );

      },error:(err)=>{
        this.toastService.error(err.error, 'Reset Password Failure')
      }
    }))
  }

  logout() {
    this.UserSubject.next(new User());
    localStorage.removeItem(USER_KEY);
  }

  getAllUser():Observable<User[]>{
    return this.http.get<User[]>(USER_URL)
  }

  getUserById(id:any):Observable<User>{
    return this.http.get<User>(USER_GET_BY_ID + id)
  }

  deleteCust(id:string):Observable<any>{
    return this.http.delete<any> (USER_DELETE + id).pipe(tap({
      next:()=>{
        Swal.fire('User Delete successfully', '', 'success');
      },error:(err)=>{
        Swal.fire('User Delete Failure', err, 'error');
      }
    }))
  }

  updatePreference(userId:string, prodId:string, rating:number){
    let preference = {
      userId: userId,
      prodId: prodId,
      rating:rating
    }
    this.http.put(USER_UPDATE_PREFERENCE,preference).subscribe(data=>{
      console.log(data)
    })
  }

  updateUser(id:string,user:User){
    let formData = new FormData()
    formData.append("data", JSON.stringify({
      isAdmin: user.isAdmin,
      id: id,
      name: user.name,
      password: user.password,
      email: user.email,
      phone: user.phone,
      country: user.country,
      address: user.address
    }))
    formData.append("avatar", user.avatar)
    return this.http.put<User>(USER_UPDATE_URL,formData).pipe(tap({
        next:()=>{
          Swal.fire('Update Success', 'Profile Update Successful','success')
        },error:(err)=>{
          Swal.fire('Update Failure', err, 'error')
        }
    }))
  }
}
