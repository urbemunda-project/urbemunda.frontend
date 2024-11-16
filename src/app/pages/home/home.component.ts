import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  ranking: any;
  isNotLogged = true; // Necessario per mostrare o meno i pulsanti di accesso o registrazione. Nascosti se l'utente è loggato

  // Costruttore
  constructor(private userService: UserService) {}

  // Avviato in automatico
  ngOnInit() {
    this.getRanking()
    if (localStorage.getItem('token')!.length>10) {
      this.isNotLogged = false;
      document.getElementById('space')?.setAttribute('style', 'justify-content: center;')
      document.getElementById('ranking')?.setAttribute('style', 'margin-bottom: 75px;')
    }
  }

  // Metodo per ottenere il ranking
  public getRanking () {
    this.userService.getRanking().subscribe((response: any) => {
      console.log(response)
      this.ranking = response.body
    })
  }

}
