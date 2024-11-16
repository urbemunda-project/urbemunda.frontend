import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/service/authentication/userdata';
import { UserService } from 'src/app/service/user/user.service';
import { Validations } from 'src/app/validations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user = null;
  submitted = false;

  // Testo da mostrare in caso di successo e in caso di errore
  message: any;
  messageTitle = 'Invio dati in corso';
  messageBody = '🕔';
  isSending = false // Sta inviando i dati
  isSent = false; // Invio dati
  isSuccess = false; // Dati inviati
  isError = false; // Errore
  isUpdating = false; // Aggiornamento
  isDeleting = false; // Eliminazione
  wantToDelete = false;

  // Variabili per definire pulsanti da mostrare
  modify = false;
  show = true;

  // Costruttore
  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  // FormGroup pagina profile
  userForm = this.fb.group({
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    birth: [null, [Validators.required]],
    cf: [null, [Validators.required, Validators.pattern(Validations.cfpattern)]],
  });

  get userFormControl() {
    return this.userForm.controls;
  }

  ngOnInit() {
    this.getUser();
  }

  // Effettua logout utente
  public doLogout() {
    this.router.navigateByUrl('');
    localStorage.clear();
    UserData.isLoggedIn = false;
  }

  // Ottiene le informazioni dell'utente
  public getUser() {
    this.userService.getUser().subscribe((response: any) => {
      this.userForm.get("name")?.setValue(response.body.name)
      this.userForm.get("surname")?.setValue(response.body.surname)
      this.userForm.get("birth")?.setValue(response.body.birth)
      this.userForm.get("cf")?.setValue(response.body.cf)
    })
  }

  // Metodi per modifica stile
  nameStyle() {
    if (
      (this.userFormControl.name.touched || this.submitted) &&
      this.userFormControl.name.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.userFormControl.name.valid) {
        return {};
      } else {
        return {};
      }
    }
  }

  surnameStyle() {
    if (
      (this.userFormControl.surname.touched || this.submitted) &&
      this.userFormControl.surname.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.userFormControl.surname.valid) {
        return {};
      } else {
        return {};
      }
    }
  }

  birthStyle() {
    if (
      (this.userFormControl.birth.touched || this.submitted) &&
      this.userFormControl.birth.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.userFormControl.birth.valid) {
        return {};
      } else {
        return {};
      }
    }
  }

  cfStyle() {
    if (
      (this.userFormControl.cf.touched || this.submitted) &&
      this.userFormControl.cf.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.userFormControl.cf.valid) {
        return {};
      } else {
        return {};
      }
    }
  }

  // Update form
  public formSubmit() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.doUpdate();
    }
  }

  // Metodo per l'aggiornamento dell'account
  public doUpdate() {
    const user = {
      name: this.userForm.get('name')?.value,
      surname: this.userForm.get('surname')?.value,
      birth: this.userForm.get('birth')?.value,
      cf: this.userForm.get('cf')?.value,
    };

    this.isSending = true;
    this.isUpdating = true;
    this.userService.updateUser(user).subscribe({

      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Account aggiornato con successo ✔️"
          this.isSent = true
          this.isSuccess = true
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
          this.isError = true
        },
          1000);
      },
    });
  }

  // Metodo per richiedere l'eliminazione
  public askDelete() {
    this.wantToDelete = true;
  }

  // Metodo per eliminare l'account
  public doDelete() {

    this.isSending = true;
    this.isDeleting = true;
    this.userService.deleteUser().subscribe({

      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Account eliminato con successo ✔️"
          this.isSent = true
          this.isSuccess = true
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
          this.isError = true
        },
          1000);
      },
    });


  }

  // Metodo per nascondere i pulsanti di modifica e di logout e mostra i pulsanti di aggiorna, elimina e annulla
  public doModify() {
    this.show = false;
    this.modify = true;
  }

  // Metodo per nascondere i pulsanti di modifica e di logout e mostra i pulsanti di aggiorna, elimina e annulla
  public doAbort() {
    this.show = true;
    this.modify = false;
    this.isSending = false;
    this.isUpdating = false;
    this.isDeleting = false;
    this.isSuccess = false;
    this.wantToDelete = false;
    this.messageTitle = 'Invio dati in corso';
    this.messageBody = '🕔';
  }

  // Metodo per ricaricare la pagina
  public doReload() {
    window.location.reload()
  }

}
