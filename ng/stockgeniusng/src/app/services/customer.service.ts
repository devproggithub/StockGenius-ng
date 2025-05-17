import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:5000/api/customers'; // Remplacez par l'URL de votre API
  private refreshListSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }


  // Observable pour indiquer qu'une mise à jour de liste est nécessaire
  refreshList$ = this.refreshListSubject.asObservable();
  
  // Déclencher un rafraîchissement de la liste
  triggerRefresh() {
    this.refreshListSubject.next(true);
  }


  // Récupérer tous les clients
  getCustomers(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  private getHeaders() {
    // Si vous avez un token stocké dans localStorage
    const token = localStorage.getItem('auth_token');    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    return { headers };
  }
  // Dans votre service customer
createCustomer(customerData: any): Observable<any> {
  const token = localStorage.getItem('auth_token');
  
  // Déboguer le token
  console.log('Token brut:', token);
  
  // Si vous avez un token, essayez de le décoder pour voir s'il est valide
  if (token) {
    try {
      // Décodage simple (la partie payload du JWT)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Payload du token:', payload);
        
        // Vérifier si le token est expiré
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const now = new Date();
          console.log('Token expire le:', expDate);
          console.log('Token expiré:', expDate < now);
        }
      }
    } catch (e) {
      console.error('Erreur de décodage du token:', e);
    }
  }
  
  // Le reste du code reste identique
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  });
  
  return this.http.post(this.apiUrl, customerData, { headers });
}

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
