import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/service/report/report.service';
import { TrashService } from 'src/app/service/trash/trash.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  submitted = false;
  typelist: any;
  sizelist: any;
  isImageSaved!: boolean;
  cardImageBase64!: string;
  cardImageFile!: any;
  isImage = false;
  isNotImage = true;

  constructor(
    private reportService: ReportService,
    private trashService: TrashService,
    private router: Router,
    private fb: FormBuilder,
  ) { }


  reportForm = this.fb.group({
    description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    trashType: [null, [Validators.required]],
    trashSize: [null, [Validators.required]],
    fileImage: [null, [Validators.required]],
  });

  // Testo da mostrare in caso di successo e in caso di errore
  message: any;
  messageTitle = 'Invio segnalazione in corso';
  messageBody = '🕔';
  isSending = false // Sta inviando i dati
  isSent = false; // Invio dati
  isSuccess: any; // Dati inviati


  ngOnInit() {
    // Metodo per ottenere le tabelle tipologiche di dimensione e tipologia rifiuto
    this.getTypologic()
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('lat', String(position.coords.latitude))
      localStorage.setItem('lng', String(position.coords.longitude))
    })
  }

  get reportFormControl() {
    return this.reportForm.controls;
  }

  // Metodo per ottenere le tabelle tipologiche di dimensione e tipologia rifiuto
  public getTypologic() {
    this.trashService.getType().subscribe((type: any) => {
      console.warn(type)
      this.typelist = type.body
    })
    this.trashService.getSize().subscribe((size: any) => {
      console.warn(size)
      this.sizelist = size.body
    })
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
    if (
      this.reportForm.valid
    ) {
      const report = {
        description: this.reportForm.get('description')?.value,
        latitude: Number(localStorage.getItem('lat')),
        longitude: Number(localStorage.getItem('lng')),
        trashType: this.reportForm.get('trashType')?.value,
        trashSize: this.reportForm.get('trashSize')?.value,
      };
      let formData = new FormData();
      formData.append('file', this.cardImageFile);
      formData.append('data', new Blob([JSON.stringify(report)], { type: "application/json" }));
      this.isSending = true;
      this.reportService.postReport(formData).subscribe({

        // Successo dal server
        next: (data) => {
          setTimeout(() => {
            this.messageTitle = "Ottimo 🙂"
            this.messageBody = "Segnalazione inviata ✔️"
            this.isSent = true;
          },
            1000);
        },

        // Errore dal server
        error: (response: any) => {
          this.message= response.error.errorRTOList[0].error
          setTimeout(() => {
            this.messageTitle = "Errore 🙁"
            this.messageBody = this.message + "❌"
            this.isSent = true;
          },
            1000);
        },
      });
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
  }

  // Metodo per pulire tutto il form
  public clearData() {
    this.cardImageBase64 = '';
    this.isImageSaved = false;
    this.cardImageFile = null;
    this.isImage = false;
    this.isNotImage = true;
    this.reportForm.get('description')?.setValue(null)
    this.reportForm.get('trashType')?.setValue(null)
    this.reportForm.get('trashSize')?.setValue(null)
    this.reportForm.get('fileImage')?.setValue(null)
    this.reportForm.get('description')?.untouched
    this.reportForm.get('trashType')?.valid
    this.reportForm.get('trashSize')?.valid
    this.reportForm.get('fileImage')?.valid
  }

  // Metodo per ricaricare la pagina
  public reloadPage() {
    window.location.reload()
  }
}
