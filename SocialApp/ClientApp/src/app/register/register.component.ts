import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model:any={};
  constructor(private authService:AuthService,private route:Router) { }

  ngOnInit(): void {
  }

  register(){
    
    this.authService.register(this.model).subscribe(()=>{
    console.log("kullanici olusturuldu");
  },() => {
    this.authService.login(this.model).subscribe(() => {
      this.route.navigate(['/members']);
    })
  });
 } 
}
