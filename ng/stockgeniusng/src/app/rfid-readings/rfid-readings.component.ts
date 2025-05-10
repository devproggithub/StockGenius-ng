// src/app/components/rfid-readings/rfid-readings.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RfidService } from '../rfid.service';

@Component({
  selector: 'app-rfid-readings',
  templateUrl: './rfid-readings.component.html',
  styleUrls: ['./rfid-readings.component.css']
})
export class RfidReadingsComponent implements OnInit, OnDestroy {
  readings: any[] = [];
  loading = false;
  error = '';
  refreshSubscription?: Subscription;
  autoRefresh = false;

  constructor(private rfidService: RfidService) { }

  ngOnInit(): void {
    this.loadReadings();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadReadings(): void {
    this.loading = true;
    this.error = '';
    
    this.rfidService.getLatestReadings().subscribe({
      next: (data) => {
        this.readings = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données RFID: ' + err.message;
        this.loading = false;
      }
    });
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    
    if (this.autoRefresh) {
      // Rafraîchir les données toutes les 3 secondes
      this.refreshSubscription = interval(3000)
        .pipe(
          switchMap(() => this.rfidService.getLatestReadings())
        )
        .subscribe({
          next: (data) => {
            this.readings = data;
          },
          error: (err) => {
            this.error = 'Erreur lors du rafraîchissement: ' + err.message;
            this.autoRefresh = false;
          }
        });
    } else if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  startRfidReader(): void {
    this.rfidService.startRfidReader().subscribe({
      next: (response) => {
        console.log('Lecteur RFID démarré', response);
      },
      error: (err) => {
        this.error = 'Erreur lors du démarrage du lecteur: ' + err.message;
      }
    });
  }

  stopRfidReader(): void {
    this.rfidService.stopRfidReader().subscribe({
      next: (response) => {
        console.log('Lecteur RFID arrêté', response);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'arrêt du lecteur: ' + err.message;
      }
    });
  }

  // Formater les données JSON pour l'affichage
  formatJson(jsonString: string): string {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  // Déterminer si une valeur est déjà un objet JSON
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}