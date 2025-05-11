import { Component, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SensorDataService } from '../sensor-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    image = $('#changingImage');
    images = [
      '../../assets/img/porte_rfid_detect.png',
      '../../assets/img/porte_rfid.png'
    ];
    minInterval = 2000; // 2 seconds
    maxInterval = 8000; // 8 seconds
    
    currentIndex: number = 0;
    timer: any;
    weight: number | null = null; // Pour stocker le poids
    lastSensorData: any = null; // Pour stocker les dernières données du capteur
    private subscription: Subscription | null = null; // Pour gérer l'abonnement à l'API
    
    constructor(
      private produitService: ProductService,
      private http: HttpClient,
      private sensorDataService: SensorDataService
    ) { }

    getscanned() {
      this.produitService.getScannedProducts().subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log('erreur lors de la récupération des produits scannés:', error);
        }
      );
    }

    // Nouvelle méthode pour obtenir les dernières données du capteur
    getLastSensorData() {
      return this.sensorDataService.getLastSensorData();
    }

    // Méthode pour surveiller les mises à jour des données du capteur
    pollSensorData(intervalMs: number = 2000) {
      return interval(intervalMs).pipe(
        switchMap(() => this.getLastSensorData())
      );
    }

    ngOnInit(): void {
      if(localStorage.getItem("logged")=="true"){
        $('body').css('background-image', 'url(../../assets/img/bg_login.jpg)');
        $('body').css('background-size', 'cover');
        $('#content-wrapper').css('background-color', 'rgb(236 239 243 / 0%) !important;');
      }
      
      this.getscanned();
      
      // Démarrer la surveillance des données du capteur
      this.subscription = this.pollSensorData(2000).subscribe(
        (response: any) => {
          if (response.success && response.data) {
            // Nouvelle donnée de capteur trouvée
            this.lastSensorData = response.data;
            
            // Vérifier si les données contiennent "0111:PEINTURE:0"
            if (response.data.value ) {
              // Mettre à jour le poids
              if (response.data.value.weight) {
                this.weight = response.data.value.weight;
                // Démarrer le changement d'image par défaut
                this.changeImage();
                // Mettre à jour le champ de poids dans l'interface
                const weightInput = document.getElementById('weight_input') as HTMLInputElement;
                if (weightInput) {
                  weightInput.value = `${this.weight} KG`;
                }
              }
              
              // Afficher l'image de détection RFID
              this.currentIndex = 0; // L'index 0 correspond à porte_rfid_detect.png
              
              // Déclencher les animations
              this.updateWarningElement();
              setTimeout(() => {
                this.updateDangerElement();
              }, 2000);
            }
          }
        },
        error => {
          console.log('Erreur lors de la surveillance des données du capteur:', error);
        }
      );
      
      
      
      // Reste de votre code ngOnInit...
    }

    changeImage() {
      // Annuler le timer précédent si existant
      if (this.timer) {
        clearTimeout(this.timer);
      }
      
      // Définir un délai fixe de 10 secondes
      const delay = 10000; // 10 secondes en millisecondes
      
      // Si l'image actuelle est l'image de détection RFID, déclencher les animations
      if(this.images[this.currentIndex].indexOf("detect") > -1) {
        this.updateWarningElement();
        setTimeout(() => {
          this.updateDangerElement();
        }, 2000);
      }
      
      // Mettre en place le nouveau timer
      this.timer = setTimeout(() => {
        // Passer à l'image suivante (avec boucle)
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        
        // Programmer le prochain changement
        this.changeImage();
      }, delay);
    }

    updateWarningElement() {
      // Votre code existant...
    }

    updateDangerElement() {
      // Votre code existant...
    }
    
    // Méthode pour formater les informations du capteur pour affichage
    formatSensorInfo(): string {
      if (!this.lastSensorData) return 'Aucune donnée disponible';
      
      const date = new Date(this.lastSensorData.saved_at);
      return `Dernière mise à jour: ${date.toLocaleString()}`;
    }
    
    ngOnDestroy(): void {
      // Nettoyer les subscriptions et timers lors de la destruction du composant
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
}