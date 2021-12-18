import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users:User[];
  public loading =false;
  userParams:any={};

  constructor(private userService:UserService,private route:Router ) { }

  ngOnInit(): void {
    this.userParams.ordeyby="lastactive";
    this.getUsers();
  }

  getUsers(){
    this.loading=true;
    this.userService.getUsers(null,this.userParams).subscribe(users=> {
      this.loading=false;
      this.users=users;
    });
  }
  

}
