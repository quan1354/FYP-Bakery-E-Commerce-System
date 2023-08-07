import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  users:Observable<User[]>
  constructor(private userService:UserService, private router:Router) {
    this.users = this.userService.getAllUser()
  }

  ngOnInit(): void {
  }

  deleteCust(custId:any){
    Swal.fire({
      title: 'Are you sure to delete User ?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteCust(custId).subscribe(()=>{
          this.refreshTable()
        })
      }
    })
  }

  refreshTable(){
    this.users = this.userService.getAllUser()
  }

  editCust(custId:any){
    this.router.navigateByUrl('/user-profile/' + custId)
  }

  searchCust(value:string){
    console.log(value)
    if(value == ''){
      this.users = this.userService.getAllUser()
    }else{
      this.users = this.users.pipe(map(users => users.filter(user => user.id.includes(value) || user.name.toLowerCase().includes(value.toLowerCase()) || user.email.toLowerCase().includes(value.toLowerCase())||user.phone.includes(value))))
    }
  }

}
