import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {

  // Costruttore
  constructor(private router: Router) {

    // Metodo per nascondere la barra quando si naviga nelle schermate home, login e signup
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url === '/login' ||
          event.url === '/signup' ||
          event.url === '/recover' ||
          event.url === '/'
        ) {
          document
            .getElementById('mainbar')
            ?.setAttribute('style', 'display: none; visibility: hidden');
        } else {
          document
            .getElementById('mainbar')
            ?.setAttribute('style', 'display: block; visibility: visible');
        }

        // Metodo per nascondere la barra quando l'utente non è loggato
        if (localStorage.getItem('token')!.length>10) {
          document
            .getElementById('mainbar')
            ?.setAttribute('style', 'display: block; visibility: visible');
        }
      }
    });
  }
  ngOnInit() {}
}
