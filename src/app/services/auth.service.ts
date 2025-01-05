import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPotinUrlA = '/auth/loginpasswordless';
  private endPotinUrlB = '/auth/login';

  constructor(private http: HttpClient) { }

  loginPasswordLess(loginTypeAdto: LoginTypeAdto): Observable<LoginTypeAdto> {

    return this.http.post<LoginTypeAdto>(this.endPotinUrlA, loginTypeAdto);
  }

  loginPassword(loginTypeBdto: LoginTypeBdto): Observable<LoginTypeBdto> {

    return this.http.post<LoginTypeBdto>(this.endPotinUrlB, loginTypeBdto);
  }

}
