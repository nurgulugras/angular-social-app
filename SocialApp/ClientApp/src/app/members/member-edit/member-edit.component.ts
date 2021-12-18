import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute, 
    private userService: UserService, 
    private authService: AuthService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data=> {
      this.user = data['user'];
    })
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user)
    .subscribe(()=> {
      console.log("profiliniz güncellendi.");
    }, err => {
      console.log(err);
    })
  }
}