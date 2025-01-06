import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPointUrlA = '/auth/loginpasswordless';
  private endPointUrlB = '/auth/login';
  private shouldPasswordUrl = '/user/should-password';
  private tokenKey = 'access_token';
  private expirationKey = 'token_expiration';

  constructor(private http: HttpClient) {}

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

  setToken(token: string, expiration: number): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expirationKey, expiration.toString());
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    const expiration = localStorage.getItem(this.expirationKey);

    if (token && expiration) {
      const now = Date.now();
      if (now < +expiration) {
        return token;
      } else {
        this.clearToken();
      }
    }
    return null;
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey);
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem(this.expirationKey);
    return expiration ? Date.now() > +expiration : true;
  }
}
