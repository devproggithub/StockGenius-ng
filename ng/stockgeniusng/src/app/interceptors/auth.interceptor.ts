// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Récupère le token d'authentification
    const token = this.authService.getToken();
    
    // Si le token existe, ajoute-le aux en-têtes de la requête
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Continue avec la requête modifiée
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Gère les erreurs d'authentification (401 Unauthorized)
        if (error.status === 401) {
          // this.authService.logout();
          this.router.navigate(['/signin']);
        }
        return throwError(error);
      })
    );
  }
}