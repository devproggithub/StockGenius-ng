import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5000/api'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }


  getScannedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rfid/readings`);
  }
  // Produits
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // Catégories
  // getAllCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  // }

  // getCategoryById(id: number): Observable<Category> {
  //   return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  // }

  // createCategory(category: Category): Observable<Category> {
  //   return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  // }

  // updateCategory(id: number, category: Category): Observable<Category> {
  //   return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category);
  // }

  // deleteCategory(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/categories/${id}`);
  // }

}
