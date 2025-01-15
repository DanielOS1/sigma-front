import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { DecodedToken } from '../interfaces/token';
import { jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPointUrlA = '/auth/loginpasswordless';
  private endPointUrlB = '/auth/login';
  private shouldPasswordUrl = '/user/should-password';
  private tokenKey = 'access_token';
  private expirationKey = 'token_expiration';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loginPasswordLess(loginTypeAdto: LoginTypeAdto): Observable<LoginTypeAdto> {
    return this.http.post<LoginTypeAdto>(this.endPointUrlA, loginTypeAdto);
  }
  loginPassword(loginTypeBdto: LoginTypeBdto): Observable<LoginTypeBdto> {

    return this.http.post<LoginTypeBdto>(this.endPointUrlB, loginTypeBdto);
  }

  checkShouldPassword(rut: string): Observable<boolean> {
    console.log('Verificando si el RUT requiere contraseña...');
    return this.http.get<boolean>(`${this.shouldPasswordUrl}/${rut}`);
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const expiration = decodedToken.exp * 1000;
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem('tokenExpiration', expiration.toString());
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getTokenExpiration(): number | null {
    const expiration = localStorage.getItem('tokenExpiration');
    return expiration ? parseInt(expiration, 10) : null;
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expirationKey);
    }
  }
  
  logout(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`/auth/logout`, {}, { headers });
  }

  requestPasswordReset(rut: string): Observable<any> {
    return this.http.get<any>(`/user/reset-password?rut=${rut}`);
  }


  
}
