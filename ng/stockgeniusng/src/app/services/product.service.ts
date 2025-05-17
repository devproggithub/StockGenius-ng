import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api';
  private refreshListSubject = new BehaviorSubject<boolean>(false);
  
  // Observable pour indiquer qu'une mise à jour de liste est nécessaire
  refreshList$ = this.refreshListSubject.asObservable();
  
  // Déclencher un rafraîchissement de la liste
  triggerRefresh() {
    this.refreshListSubject.next(true);
  }

  constructor(private http: HttpClient) { }

  // Méthode pour ajouter les en-têtes d'authentification
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // CRUD pour les produits
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product, { headers: this.getHeaders() })
      .pipe(tap(() => this.triggerRefresh()));
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product, { headers: this.getHeaders() })
      .pipe(tap(() => this.triggerRefresh()));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() })
      .pipe(tap(() => this.triggerRefresh()));
  }

  // Services pour les catégories et zones
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`, { headers: this.getHeaders() });
  }

  getAllZones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/zones`, { headers: this.getHeaders() });
  }

  // Récupérer les données RFID
  getScannedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rfid/readings`, { headers: this.getHeaders() });
  }
}