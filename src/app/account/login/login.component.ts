import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validations } from 'src/app/validations';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  submitted = false; // Usato per la validazione dei dati

  // Testo da mostrare in caso di successo e in caso di errore
  message: any;
  messageTitle = 'Invio dati in corso';
  messageBody = '🕔';
  isSending = false;
  isSent = false;

  // Costruttore
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService) {}

  // FormGroup di login
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(Validations.emailpattern)]],
    password: ['', [Validators.required, Validators.pattern(Validations.passwordpattern), Validators.minLength(8), Validators.maxLength(16)]],
  });

  // Controllo sul form di login
  get loginFormControl() {
    return this.loginForm.controls;
  }

  // Metodi di cambio stile
  emailStyle() {
    if (
      (this.loginFormControl.email.touched || this.submitted) &&
      this.loginFormControl.email.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.loginFormControl.email.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  passwordStyle() {
    if (
      (this.loginFormControl.password.touched || this.submitted) &&
      this.loginFormControl.password.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.loginFormControl.password.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  // Metodo avvia automaticamente Google
  ngOnInit() { }

  // Metodo per l'invio del form
  public formSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.doLogin();
    }
  }

  // Metodo che effettua il login
  public doLogin() {
    const loginTime = Date()
    const loginDetails = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.isSending = true
    this.userService.login(loginDetails).subscribe({

      // Successo dal server
      next: (response: any) => {
        localStorage.setItem('token', response.jwt)
        localStorage.setItem('id', response.userId)
        localStorage.setItem('loginTime', String(loginTime))
        if (response.admin === true) {
          localStorage.setItem('admin', String(true))
        } else {
          localStorage.setItem('admin', String(false))
          localStorage.setItem('normal', String(true))
        }
        setTimeout(() => {
          this.router.navigateByUrl('/profile')
        },
          1000);
      },

      // Errore dal server
      error: (response: any) => {
        this.message= response.error.errorRTOList[0].error
        setTimeout(() => {
          this.messageTitle = "Errore 🙁"
          this.messageBody = this.message + "❌"
          this.isSent = true
        },
          1000);
      },
    });
  }

  // Metodo per andare alla homepage
  public goToHomepage() {
    this.router.navigateByUrl('/')
  }

}
