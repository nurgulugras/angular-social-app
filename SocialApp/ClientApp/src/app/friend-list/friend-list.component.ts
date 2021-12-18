import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {

  users:User[];
  followParams:string="followings";
  constructor(private userService:UserService ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getUsers(this.followParams).subscribe(users=> {
      this.users=users;
    });
  }
  
}
