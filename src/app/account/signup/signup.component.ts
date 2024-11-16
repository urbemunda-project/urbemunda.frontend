import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';
import { Validations } from 'src/app/validations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  submitted1 = false;
  submitted2 = false;

  // Testo da mostrare in caso di successo e in caso di errore
  message: any;
  messageTitle = 'Invio dati in corso';
  messageBody = '🕔';
  isSending = false; // Sta inviando i dati
  isSent = false; // Invio dati
  isSuccess: any; // Dati inviati

  // Costruttore
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  // FormGroup di signup
  signupForm = this.fb.group({
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    birth: [null, [Validators.required]],
    cf: [
      null,
      [Validators.required, Validators.pattern(Validations.cfpattern)],
    ],
    email: [null, [Validators.required, Validators.email]],
    emailcheck: [null, [Validators.required]],
    password: [
      null,
      [
        Validators.required,
        Validators.pattern(Validations.passwordpattern),
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
    ],
    passwordcheck: [null, [Validators.required]],
  });

  get signupFormControl() {
    return this.signupForm.controls;
  }

  ngOnInit() {
    document
      .getElementById('container2')
      ?.setAttribute('style', 'display: none; visibility: hidden');
  }

  // Metodo per passare alla seconda sezione
  public nextData() {
    this.submitted1 = true;
    if (
      this.signupFormControl.name.invalid ||
      this.signupFormControl.surname.invalid ||
      this.signupFormControl.cf.invalid ||
      this.signupFormControl.birth.invalid
    ) {
      this.previousData();
    } else {
      document
        .getElementById('container1')
        ?.setAttribute('style', 'display: none; visibility: hidden');
      document
        .getElementById('container2')
        ?.setAttribute('style', 'display: block; visibility: visible');
    }
  }


  
  // Metodo per passare alla prima sezione
  public previousData() {
    document
      .getElementById('container1')
      ?.setAttribute('style', 'display: block; visibility: visible');
    document
      .getElementById('container2')
      ?.setAttribute('style', 'display: none; visibility: hidden');
  }

  // Metodi per modifica stile
  nameStyle() {
    if (
      (this.signupFormControl.name.touched || this.submitted1) &&
      this.signupFormControl.name.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.name.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  surnameStyle() {
    if (
      (this.signupFormControl.surname.touched || this.submitted1) &&
      this.signupFormControl.surname.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.surname.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  birthStyle() {
    if (
      (this.signupFormControl.birth.touched || this.submitted1) &&
      this.signupFormControl.birth.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.birth.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  cfStyle() {
    if (
      (this.signupFormControl.cf.touched || this.submitted1) &&
      this.signupFormControl.cf.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.cf.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  emailStyle() {
    if (
      (this.signupFormControl.email.touched || this.submitted2) &&
      this.signupFormControl.email.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.email.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  emailCheckStyle() {
    if (
      (this.signupFormControl.emailcheck.touched || this.submitted2) &&
      this.signupFormControl.emailcheck.value !==
        this.signupFormControl.email.value
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.emailcheck.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  passwordStyle() {
    if (
      (this.signupFormControl.password.touched || this.submitted2) &&
      this.signupFormControl.password.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.password.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  passwordCheckStyle() {
    if (
      (this.signupFormControl.passwordcheck.touched || this.submitted2) &&
      this.signupFormControl.passwordcheck.value !==
        this.signupFormControl.password.value
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.signupFormControl.passwordcheck.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  // Metodo chiamato all'invio del form
  public formSubmit() {
    this.submitted2 = true;
    if (this.signupForm.valid) {
      this.doSignup();
    }
  }

  // Metodo per eseguire il signup
  public doSignup() {
    const user = {
      name: this.signupForm.get('name')?.value,
      surname: this.signupForm.get('surname')?.value,
      birth: this.signupForm.get('birth')?.value,
      cf: this.signupForm.get('cf')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
    };
    this.isSending = true;
    this.userService.signup(user).subscribe({
      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = 'Ottimo 🙂';
          this.messageBody = 'Account creato con successo ✔️';
          this.isSent = true;
          this.isSuccess = true;
        }, 1000);
      },

      // Errore dal server
      error: (response: any) => {
        this.message = response.error.errorRTOList[0].error;
        setTimeout(() => {
          this.messageTitle = 'Errore 🙁';
          this.messageBody = this.message + '❌';
          this.isSent = true;
          this.isSuccess = false;
        }, 1000);
      },
    });
  }

  // Metodo per andare alla homepage
  public goToHomepage() {
    this.router.navigateByUrl('/');
  }
}
