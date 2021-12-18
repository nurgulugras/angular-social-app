import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageCreateComponent } from 'src/app/messages/message-create/message-create.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  
  user:User;
  followText:string="Follow"
  constructor(private userService:UserService,private route:ActivatedRoute,private authService:AuthService,private modalService:NgbModal) { }

  ngOnInit(): void {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(user=>{
      this.user=user;
      console.log(user);
    })
  }
  //members/3
  getUser(){
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(user=>{
    this.user=user;
    });
  }

  followUser(userid:number){
    this.userService.followUser(this.authService.decodedToken.nameid,userid)
    .subscribe(result => {
      console.log(this.user.name + 'kullanicisini takip ediyorsunuz');
      this.followText="Following"
    })
  }
  openSendMessageModel(){
     const modelRef=this.modalService.open(MessageCreateComponent);
     modelRef.componentInstance.recipient=this.user.id;
  }
}
