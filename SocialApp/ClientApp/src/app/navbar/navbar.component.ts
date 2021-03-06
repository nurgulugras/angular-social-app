import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import{Router} from '@angular/router';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model:any={}

  constructor(public authService:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  login(){
    this.authService.login(this.model)
      .subscribe(
      next => {
        window.alert("login successful");
        this.router.navigate(['/members']);
      }, 
     
      error=>{
        
        console.log(error);
      }
    )
    
    }
    
  loggedIn(){
     return this.authService.loggedIn();
}

  logout(){
     localStorage.removeItem("token")
     console.log("logout");
     this.router.navigate(['/home']);
  }

}
