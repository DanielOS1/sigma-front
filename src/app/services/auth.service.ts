import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto } from '../interfaces/logintypeAdto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPotinUrl = '/auth/loginpasswordless';

  constructor(private http: HttpClient) { }

  loginPasswordLess(loginTypeAdto: LoginTypeAdto): Observable<LoginTypeAdto> {

    return this.http.post<LoginTypeAdto>(this.endPotinUrl, loginTypeAdto);
  }
}
