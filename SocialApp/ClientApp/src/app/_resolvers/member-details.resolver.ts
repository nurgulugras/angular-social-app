import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailsResolver implements Resolve<User> {

    constructor(private userService: UserService, 
        private authService: AuthService,
        private route: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<any> | Promise<any> {
        return this.userService
        .getUser(route.params['id'])
        .pipe(catchError(error=> {
            console.log("error");
            this.route.navigate(['/members']);
            return of(null);
        }))
    }

}

