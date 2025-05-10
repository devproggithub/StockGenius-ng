// src/app/services/rfid.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfidService {

  private apiUrl = 'http://127.0.0.1:5000';
  token:any;
  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('access_token');
  }

  // Récupérer les dernières lectures RFID
  getLatestReadings(limit: number = 10): Observable<any[]> {
    const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
      'Authorization': "Bearer "+this.token
    });
    
    return this.http.get<any[]>(this.apiUrl+"/api/rfid/readings?limit="+limit, { headers });
  }

  // Méthode pour démarrer le lecteur RFID
  startRfidReader(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': "Bearer "+this.token
    });
    return this.http.post<any>(this.apiUrl+"/api/rfid/start",{}, {headers});
  }

  // Méthode pour arrêter le lecteur RFID
  stopRfidReader(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': "Bearer "+this.token
    });
    return this.http.post<any>(this.apiUrl+"/api/rfid/stop", {}, {headers});
  }
}