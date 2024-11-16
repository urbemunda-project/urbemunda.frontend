import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClusterService } from 'src/app/service/cluster/cluster.service';
import { ReportService } from 'src/app/service/report/report.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() data: any;
  @Input() typelist: any;
  @Input() sizelist: any;

  // Sezione modifica
  submitted = false;
  isImageSaved!: boolean;
  cardImageBase64!: string;
  cardImageFile!: any;
  isImage = false;
  isNotImage = true;
  isImageNotUpdated = true;
  isImageUpdated = false;

  reportForm = this.fb.group({
    description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    trashType: [null, [Validators.required]],
    trashSize: [null, [Validators.required]],
    fileImage: ['test'],
  });

  // Necessari per mostrare la card e il menu secondario
  isMain = true;
  isSecond = false;

  // Necessari per la data della pulizia
  isCleaned = true;
  isNotCleaned = false;
  notCleaned = "Non pulito"

  // Necessari per mostrare elementi in base al ruolo
  admin: any;
  normal: any;

  modify = false;

  // Testo da mostrare in caso di successo e in caso di errore
  message: any;
  isDeleteCard = false;
  messageTitle = 'Invio richiesta in corso';
  messageBody = '🕔';
  isSending = false // Sta inviando i dati
  isSent = false; // Invio dati
  isSuccess = false; // Dati inviati
  isError = false; // Errore
  isUpdating = false; // Aggiornamento
  isDeleting = false; // Eliminazione
  wantToDelete = false;

  constructor(
    private reportService: ReportService,
    private clusterService: ClusterService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    if (this.data.cleaningDate == null) {
      this.isCleaned = true;
      this.isNotCleaned = false;
    } else {
      this.isCleaned = false;
      this.isNotCleaned = true;
    }
    if (localStorage.getItem('admin') === "false") {
      this.admin = false
      this.normal = true
    } else {
      this.admin = true
      this.normal = false
    }

    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('lat', String(position.coords.latitude))
      localStorage.setItem('lng', String(position.coords.longitude))
    })
  }

  // Metodi sezione modifica
  get reportFormControl() {
    return this.reportForm.controls;
  }

  // Style descrizione
  descriptionStyle() {
    if (
      (this.reportFormControl.description.touched || this.submitted) &&
      this.reportFormControl.description.invalid
    ) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.reportFormControl.description.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  // Style tipo
  typeStyle() {
    if (this.submitted && this.reportFormControl.trashType.invalid) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.reportFormControl.trashType.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  // Style dimesione
  sizeStyle() {
    if (this.submitted && this.reportFormControl.trashSize.invalid) {
      return { 'background-color': '#ffebee', border: '1px solid #ffcdd2' };
    } else {
      if (this.reportFormControl.trashSize.valid) {
        return { 'background-color': '#e8f5e9', border: '1px solid #c8e6c9' };
      } else {
        return {};
      }
    }
  }

  // Metodo per l'invio del form
  public formSubmit() {
    this.submitted = true;
    if (this.reportFormControl.description.valid
      && this.reportFormControl.trashType.valid
      && this.reportFormControl.trashSize.valid) {
      const report = {
        description: this.reportForm.get('description')?.value,
        trashType: this.reportForm.get('trashType')?.value,
        trashSize: this.reportForm.get('trashSize')?.value,
      };

      let formData = new FormData();
      formData.append('file', this.cardImageFile);
      formData.append('data', new Blob([JSON.stringify(report)], { type: "application/json" }));

      this.isUpdating = true;
      this.reportService.updateReport(formData, this.data.reportId).subscribe({

        // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Segnalazione aggiornata ✔️"
          this.isSent = true
          this.isSuccess = true
        },
          1000);
      },

      // Errore dal server
      error: (response: any) => {
        setTimeout(() => {
          this.messageTitle = "Errore 🙁"
          this.messageBody = "Segnalazione non aggiornata, riprova più tardi ❌"
          this.isSent = true
          this.isError = true
        },
          1000);
      },
      });
    } else {
      console.warn("non valido")
    }
  }

  // Trasferimento click
  public clickUpload() {
    document.getElementById('inputupload')?.click
  }

  // Metodo invocato al caricamento dell'immagine
  public fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {

      // Controlli su dimensione e tipologia file
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      this.cardImageFile = fileInput.target.files[0];
      this.isImage = true;
      this.isNotImage = false;
      this.isImageNotUpdated = false;
      this.isImageUpdated = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  // Metodo per rimuovere l'immagine caricata
  public removeImage() {
    this.cardImageBase64 = '';
    this.isImageSaved = false;
    this.cardImageFile = null;
    this.isImage = false;
    this.isNotImage = true;
    this.isImageNotUpdated = false;
    this.isImageUpdated = false;
  }

  // Metodo per pulire tutto il form
  public clearData() {
    this.cardImageBase64 = '';
    this.isImageSaved = false;
    this.cardImageFile = null;
    this.isImage = false;
    this.isNotImage = true;
    this.isImageNotUpdated = false;
    this.isImageUpdated = false;
    this.reportForm.get('description')?.setValue(null)
    this.reportForm.get('trashType')?.setValue(null)
    this.reportForm.get('trashSize')?.setValue(null)
    this.reportForm.get('fileImage')?.setValue(null)
  }

  public openModify() {
    this.isMain = false;
    this.isSecond = true;
  }

  public closeModify() {
    this.isMain = true;
    this.isSecond = false;
    this.modify = false;
  }

  public backToModify() {
    this.isMain = false;
    this.isSecond = true;
    this.modify = false;
  }

  // Metodo per eliminare una segnalazione
  public deleteReport() {

    this.isSending = true;
    this.isDeleting = true;

    this.reportService.deleteReport(this.data.reportId).subscribe({

      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Segnalazione eliminata ✔️"
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
    this.isMain = false;
    this.isSecond = false;
    this.isDeleteCard = true;
  }

  // Metodo per la modifica segnalazione
  public modifyReport() {
    this.modify = true;
    this.isSecond = false;
    this.bindData();
  }

  // Metodo per la pulizia della segnalazione. Solo ADMIN può richiamarlo
  public cleanReport() {

    this.isSending = true;
    this.isDeleting = true;

    this.clusterService.cleanCluster(this.data.clusterId).subscribe({

      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Segnalazione pulita ✔️"
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
    this.isMain = false;
    this.isSecond = false;
    this.isDeleteCard = true;
  }

  // Metodo per definire il colore del tipo rifiuto
  public getColor(data): any {
    switch (data) {
      case 'Plastica':
        return '#f9a825';
      case 'Carta':
        return '#1565c0';
      case 'Vetro':
        return '#388e3c';
      case 'Indifferenziata':
        return '#455a64';
      case 'Metallo':
        return '#f9a825';
      case 'Organico':
        return '#795548';
      case 'Pericoloso':
        return '#b71c1c';
      case 'Elettronico':
        return '#006064';
    }
  }

  // Metodo per il data binding all'apertura della sezione modifica
  public bindData() {
    this.reportForm.get('description')?.setValue(this.data.description)
    this.reportForm.get('trashType')?.setValue(this.data.trashType)
    this.reportForm.get('trashSize')?.setValue(this.data.trashSize)
    this.isImageSaved = true;
    this.isNotImage = false;
  }

  // Metodo per chiudere la schermata di avvenuta pulizia
  public closeCardMessage() {
    this.isSecond = false;
    this.isDeleteCard = false;
    this.router.navigateByUrl('/history')
  }

  // Metodo per il reload della pagina
  public doReload() {
    window.location.reload()
  }
}
