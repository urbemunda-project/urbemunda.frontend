import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Backend } from 'src/app/configuration';
import { UserData } from './userdata';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit{

  isLoggedIn = UserData.isLoggedIn;
  isAdmin = UserData.isAdmin;


  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isLoggedIn = UserData.isLoggedIn;
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  refreshAuthToken() {
    return of('superSecretTokenRefreshed');
  }


  isAuthenticated() {
    if (localStorage.getItem('token')!.length>10) {
      return true
    } else {
      return false
    }
  }

  isRoleAdmin() {
    return UserData.isAdmin;
  }

  LoginWithGoogle(credentials: string) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.httpClient.post(Backend.url + "/authenticate/login/google", credentials, { headers: header });
  }

}
