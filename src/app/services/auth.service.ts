import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NavigationService } from './navigation.service';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/entities/user.interface';
import { DecodedToken } from '../interfaces/entities/user.interface';
import { jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse, LoginApiResponse, LoginResponse } from '../types/response.interface';
import { UserRole } from '../interfaces/entities/user.interface';

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
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loginPasswordLess(loginTypeAdto: LoginTypeAdto): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>(this.endPointUrlA, loginTypeAdto).pipe(
      tap(response => {
        if (response.success) {
          this.navigationService.navigateByRole(response.data.role as UserRole);
        }
      })
    );
  }

  loginPassword(loginTypeBdto: LoginTypeBdto): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>(this.endPointUrlB, loginTypeBdto).pipe(
      tap(response => {
        if (response.success) {
          this.navigationService.navigateByRole(response.data.role as UserRole);
        }
      })
    );
  }

  checkShouldPassword(rut: string): Observable<boolean> {
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

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
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
