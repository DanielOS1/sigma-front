import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { DecodedToken } from '../interfaces/token';
import { jwtDecode } from "jwt-decode";

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

  setToken(token: string): void {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const expiration = decodedToken.exp * 1000;
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem('tokenExpiration', expiration.toString());
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getTokenExpiration(): number | null {
    const expiration = localStorage.getItem('tokenExpiration');
    return expiration ? parseInt(expiration, 10) : null;
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('tokenExpiration');
    
  }
  
  logout(): Observable<any> {

    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.put<any>(`/auth/logout`, {}, {headers});

   
  }

  requestPasswordReset(rut: string): Observable<any> {
    return this.http.get<any>(`/user/reset-password?rut=${rut}`);
  }


  
}
