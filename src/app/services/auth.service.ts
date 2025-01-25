import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { DecodedToken } from '../interfaces/token';
import { jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse, LoginApiResponse, LoginResponse } from '../types/response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPointUrlA = '/auth/loginpasswordless';
  private endPointUrlB = '/auth/login';
  private shouldPasswordUrl = '/user/should-password';
  private tokenKey = 'access_token';
  private expirationKey = 'token_expiration';
  private rememberMeKey = 'remember_me';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loginPasswordLess(loginTypeAdto: LoginTypeAdto): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>(this.endPointUrlA, loginTypeAdto);
  }

  loginPassword(loginTypeBdto: LoginTypeBdto): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>(this.endPointUrlB, loginTypeBdto);
  }

  

  checkShouldPassword(rut: string): Observable<boolean> {
    console.log('Verificando si el RUT requiere contraseña...');
    return this.http.get<boolean>(`${this.shouldPasswordUrl}/${rut}`);
  }

  setToken(token: string, rememberMe: boolean = false): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const expiration = decodedToken.exp * 1000;
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.tokenKey, token);
        storage.setItem(this.expirationKey, expiration.toString());
        
        
        localStorage.setItem(this.rememberMeKey, rememberMe.toString());
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
        const sessionToken = sessionStorage.getItem(this.tokenKey);
      if (sessionToken) {
        return sessionToken;
      }
      
      const localToken = localStorage.getItem(this.tokenKey);
      if (localToken) {
        return localToken;
      }
    }
    return null;
  }

  getTokenExpiration(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const sessionExpiration = sessionStorage.getItem(this.expirationKey);
      if (sessionExpiration) {
        return parseInt(sessionExpiration, 10);
      }

      const localExpiration = localStorage.getItem(this.expirationKey);
      if (localExpiration) {
        return parseInt(localExpiration, 10);
      }
    }
    return null;
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.expirationKey);
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expirationKey);
      localStorage.removeItem(this.rememberMeKey);
    }
  }

  isRememberMeActive(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
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

  getDecodedToken() {
    const token = this.getToken();
    if (token) {
        return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
  }

  request2FASetup(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`/auth/enable-two-step-auth`, {}, { headers });  
  }

  verify2FA(code: string, rut: string, deviceId: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/auth/verify-2fa`, { code, rut, deviceId });
  }

  disable2FA(password: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`/auth/disable-two-step-auth`, { password }, { headers });
  }
}
