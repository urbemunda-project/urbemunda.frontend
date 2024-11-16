import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/service/report/report.service';
import { TrashService } from 'src/app/service/trash/trash.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  reports: any;
  notempty: any;
  empty: any;
  typelist: any;
  sizelist: any;
  numPages: any;
  currentPage: any;
  isAdmin: any;

  // Costruttore
  constructor(private reportService: ReportService, private trashService: TrashService) { }

  // Avviato automaticamente
  ngOnInit() {
    this.isAdmin = localStorage.getItem('admin')
    // Controllo se l'utente loggato è admin o normale
    if (localStorage.getItem('admin') === "false") {
      this.isAdmin = false
      this.getReports(1, 'latest')
      this.getTypologic()
    } else {
      this.isAdmin = true
      this.getAdminReports(1, 'latest')
    }
  }

  // Paginazione
  public numSequence(n: number): Array<number> {
    return Array(n);
  }

  // Metodo chiamato se l'utente è Admin
  public getAdminReports(page, order) {
    this.reportService.getReportsAdmin(page, order).subscribe( {

      // Successo dal server
      next: (response: any) => {
        this.reports = response.body.reportRTOList
        this.numPages = response.body.numberOfPages
        localStorage.setItem('pages', String(response.body.numberOfPages))
        localStorage.setItem('currentPage', page)
        localStorage.setItem('orderBy', order)
        this.currentPage = page
        this.notempty = true;
        this.empty = false;
      },

      // Errore dal server
      error: () => {
        this.empty = true
        this.notempty = false;
      },
    })
  }

  // Metodo chiamato se l'utente è Normale
  public getReports(page, order) {
    this.reportService.getReports(page, order).subscribe({

      // Successo dal server
      next: (response: any) => {
        this.reports = response.body.reportRTOList
        this.numPages = response.body.numberOfPages
        localStorage.setItem('pages', String(response.body.numberOfPages))
        localStorage.setItem('currentPage', page)
        localStorage.setItem('orderBy', order)
        this.currentPage = page
        this.notempty = true;
        this.empty = false;
      },

      // Errore dal server
      error: () => {
        this.empty = true
        this.notempty = false;
      },

    })
  }

  // Salva il tipo di ordine in LocalStorage
  public setOrderBy(order) {
    localStorage.setItem('orderBy', order)
  }

  // Salva il tipo di ordine in LocalStorage
  public getOrderBy() {
    return localStorage.getItem('orderBy')
  }

  // Metodo per ottenere le tabelle tipologiche di dimensione e tipologia rifiuto
  public getTypologic() {
    this.trashService.getType().subscribe((type: any) => {
      this.typelist = type.body
    })
    this.trashService.getSize().subscribe((size: any) => {
      this.sizelist = size.body
    })
  }
}
