import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
//import {  AmplifyService } from './amplify';
import {UserService} from "./user"



@Injectable(
  { providedIn: 'root',}
)
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const currentUser = this.userService.getCurrentUser();
    console.log(currentUser)
    if (!currentUser) {
      if (state.url === '' || state.url === '/') {
        this.router.navigate(['/client']);
        return of(false);
      } else if (state.url.includes('/auth')) {
        return of(true);
      } else {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      }

    }




    else if (state.url.includes('/client')) {
      return of(true);
    } else if (state.url.includes('/auth') ) {
      this.router.navigate(['/']);
      return of(false);
    } else {
      this.router.navigate(['/client']);
      return of(false);
    }
  }
}
