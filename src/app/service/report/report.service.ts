import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { Backend } from 'src/app/configuration';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) { }

  // Metodo per la creazione della segnalazione
  public postReport(report: any) {
    const headers = new HttpHeaders()
        .set("Accept", "*/*")
    return this.http.post(
      Backend.url + '/reports/', report, {headers: headers});
  }

  // Metodo per eliminare una segnalazione
  public deleteReport(id: number): Observable<any>  {
    return this.http.delete(Backend.url + '/reports/delete/' + id);
  }

  // Metodo per ottenere una sola segnalazione
  public getReport(id: any) {
    return this.http.get(
      Backend.url + '/reports/' + id);
  }

  // Metodo per ottenere le segnalazioni con paging per utente normale
  public getReports(page: any, order: any) {
    return this.http.get(
      Backend.url + '/reports/user/paging/' + page + '/orderby/' + order);
  }

  // Metodo per ottenere le segnalazioni con paging per utente normale
  public getReportsCluster(id: any) {
    return this.http.get(
      Backend.url + '/reports/cluster/' + id);
  }

  // Metodo per ottenere le segnalazioni con paging per utente admin
  public getReportsAdmin(page: any, order: any) {
    return this.http.get(
      Backend.url + '/reports/admin/paging/' + page + '/orderby/' + order);
  }

  // Metodo per ottenere la lista di tutte le segnalazioni dell'utente
  public getAllReports() {
    return this.http.get(
      Backend.url + '/reports/');
  }


  // Metodo per l'update della segnalazione
  public updateReport(report: any, id: any) {
    const headers = new HttpHeaders()
        .set("Accept", "*/*")
    return this.http.put(
      Backend.url + '/reports/update/' + id, report, {headers: headers});
  }
}
