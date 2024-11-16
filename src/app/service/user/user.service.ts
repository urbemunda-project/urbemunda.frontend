import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/configuration';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Metodo per il signup
  public signup(user: any) {
    return this.http.post(Backend.url + '/users/', user);
  }

  // Metodo per il login
  public login(loginDetails: any) {
    return this.http.post(Backend.url + '/authenticate/login', loginDetails)
  }

  // Login con Google
  public loginGoogle(token: any) {
    return this.http.post(Backend.url + '/authenticate/login/google', token)
  }

  // Metodo di per ottenere i dati dell'utente
  public getUser(): Observable<any> {
    return this.http.get(Backend.url + '/users/singleuser/' + localStorage.getItem('id'));
  }

  // Metodo per eliminare l'account
  public deleteUser(): Observable<any> {
    return this.http.delete(Backend.url + '/users/delete/' + localStorage.getItem('id'));
  }

  // Metodo per fare update user
  public updateUser(user) {
    return this.http.put(Backend.url + '/users/update/' + localStorage.getItem('id'), user);
  }

  // Metodo di per ottenere il ranking
  public getRanking(): Observable<any> {
    return this.http.get(Backend.url + '/ranking');
  }

}
