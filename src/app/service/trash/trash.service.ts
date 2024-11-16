import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/configuration';

@Injectable({
  providedIn: 'root'
})
export class TrashService {

  constructor(private http: HttpClient) { }

  // Metodo di per ottenere le tipologie
  public getType(): Observable<any> {
    return this.http.get(Backend.url + '/type');
  }

  // Metodo di per ottenere le dimensioni
  public getSize(): Observable<any> {
    return this.http.get(Backend.url + '/size');
  }

}
