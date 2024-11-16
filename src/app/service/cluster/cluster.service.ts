import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/configuration';

@Injectable({
  providedIn: 'root'
})
export class ClusterService {

  constructor(private http: HttpClient) { }

  // Metodo per ottenere la lista di tutti i cluster
  public getCluster(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(Backend.url + '/cluster', { 'headers': headers});
  }

  // Metodo per ottenere un cluster
  public getClusterId(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this.http.get(Backend.url + '/cluster/' + id, { 'headers': headers});
  }

  // Metodo per eliminare (logic delete) il cluster
  public cleanCluster(id): Observable<any> {
    return this.http.delete(Backend.url + '/cluster/delete/' + id);
  }

}
