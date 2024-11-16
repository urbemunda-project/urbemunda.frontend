import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ClusterService } from 'src/app/service/cluster/cluster.service';
import { ReportService } from 'src/app/service/report/report.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  zoom = 15;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapId: "76a9da4698d4e58",
    mapTypeId: 'roadmap',
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    disableDefaultUI: true,
    maxZoom: 18,
  }

  // Variabili
  isAdmin = false;
  cluster: any;
  reports: any;

  // Markers
  markers = [] as any;
  infoContent = '';
  infoId = '';
  clusteropen = false;

  // Dati mostrati nella card
  trashSize = '';
  trashType= '';
  reportCount= '';
  description = '';
  fileImage = '';
  clusterNotReady = true;
  clusterReady = false;

  // Messaggio di avvenuta pulizia
  message: any;
  isSending = false // Sta inviando i dati
  isSent = false; // Invio dati
  messageTitle = 'Invio dati in corso';
  messageBody = '🕔';
  isSuccess = false; // Dati inviati
  isError = false; // Errore


  // Costruttore
  constructor(private clusterService: ClusterService, private reportService: ReportService) {
  }

  ngOnInit() {
    if (localStorage.getItem('admin') == 'true') {
      this.isAdmin = true;
    }
    this.center = {
      lat: 41.11765708731628,
      lng: 16.867824443857625,
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
    this.getCluster()
  }

  // Metodo per mostrare i cluster
  public showCluster() {
    if (this.clusteropen === false) {
      this.clusteropen = true;
      console.warn(this.cluster)
      for (var i = 0; i < this.cluster.length; i++) {
        this.dropMarker(this.cluster[i])
      }
    }
  }

  // Drop marker
  dropMarker(event: any) {
    this.markers.push({
      position: {
        lat: event.latitude,
        lng: event.longitude,
      },
      label: {
        color: 'black',
        text: event.trashTypeCluster[0].type,
      },
      title: String(event.idCluster),
      info: event.reportId,
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
  }

  // Open cluster info
  public openInfo(marker: MapMarker, title: string, info: string) {
    this.infoContent = info;
    this.infoId = title;
    this.info.open(marker)

    this.isSending = false;
    this.isSent = false;

    this.clusterService.getClusterId(this.infoId).subscribe((response: any) => {
      this.trashSize = response.body.trashSizeCluster[0].size
      this.trashType = response.body.trashTypeCluster[0].type
      this.reportCount = response.body.reportCount
    })
    this.getReport(this.infoContent[0])
  }

  // Reset cluster
  public resetClusterReady() {
    this.clusterNotReady = true;
    this.clusterReady = false;
  }

  // Metodo del pulsante pulisci per pulire il cluster
  public markClean(id) {
    this.cleanCluster(id)
  }

  // Metodo per ottenere una segnalazione
  public getReport(id) {
    this.reportService.getReport(id).subscribe((response: any) => {
      this.reports = response.body
      this.description = response.body.description
      this.fileImage = response.body.fileImage
      this.clusterNotReady = false;
      this.clusterReady = true;
    })
  }

  // Metodo per ottenere le coordinate
  public findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.warn(this.center)
        localStorage.setItem('lat', String(position.coords.latitude));
        localStorage.setItem('lng', String(position.coords.longitude));
      });
    } else {
      alert('Geolocalizzazione non supportata');
    }
  }

  // Metodo per ottenere i cluster
  public getCluster() {
    this.clusterService.getCluster().subscribe((response: any) => {
      console.log(response);
      this.cluster = response.body;
    });
  }

  // Metodo per pulire un cluster (delete logico)
  public cleanCluster(id) {

    this.isSending = true;

    this.clusterService.cleanCluster(id).subscribe({

      // Successo dal server
      next: () => {
        setTimeout(() => {
          this.messageTitle = "Ottimo 🙂"
          this.messageBody = "Cluster pulito ✔️"
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

  // Metodo per il reload della pagina
  public doReload() {
    window.location.reload()
  }

}
