import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        /** 
        if (error.status === 401 && !this.authService.isTokenExpired()) {
          // Intentar renovar el token
          return this.http.post('/api/refresh-token', {}).pipe(
            switchMap((response: any) => {
              this.authService.setToken(response.accessToken, response.expiration);
              const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
              });
              return next.handle(cloned);
            }),
            catchError(err => {
              this.authService.clearToken();
              return throwError(() => err);
            })
          );
        }
          */
        return throwError(() => error);
      })
    );
  }
}
