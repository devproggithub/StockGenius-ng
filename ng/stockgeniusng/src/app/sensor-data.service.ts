import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  // URL du backend - ajustez selon votre configuration
  private apiBaseUrl = 'http://localhost:5000/api'; // Utiliser l'URL du backend, pas celle du serveur Angular

  constructor(private http: HttpClient) { }

  // Ajoutez les headers d'authentification si nécessaire
  private getHeaders() {
    // Si vous avez un token stocké dans localStorage
    const token = localStorage.getItem('auth_token');
    console.log(token);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return { headers };
  }

  // Obtenir les dernières données du capteur
  getLastSensorData(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/last_sensor_data`, this.getHeaders());
  }

  // Polling pour vérifier périodiquement les nouvelles données
  pollLastSensorData(intervalMs: number = 2000): Observable<any> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getLastSensorData())
    );
  }

  // Récupérer les produits scannés
  getScannedProducts(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/rfid/readings`, this.getHeaders());
  }
}