import { Component, OnInit } from '@angular/core';
import { UserData } from './service/authentication/userdata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit() {
    /* Se la sessione scade, LocalStorage viene svuotato */
    this.calculateDiff(localStorage.getItem('loginTime'))
    if (Number(localStorage.getItem('timeLogged'))>180) {
      localStorage.clear()
      UserData.isLoggedIn = false;
    }
  }
  title = 'Urbe Munda';

  public calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    localStorage.setItem('currentTime', String(currentDate));
    let diff = (Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate(), dateSent.getHours(), dateSent.getMinutes(), dateSent.getSeconds()));
    let minutes = diff/(1000*60)
    localStorage.setItem('timeLogged', String(minutes))
  }
}
