import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService) {}




  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return this.authService.isAuthenticated();
  }



  canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot){
    return this.authService.isRoleAdmin();
  }
}
