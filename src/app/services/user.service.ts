import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../interfaces/users/usersDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private myInfoEndPoint = "/auth/get-my-info"
  private createUserEndPoint = "/system-admin/register"

  getUser(): Observable<any> {

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.get<any>(`${this.myInfoEndPoint}`, { headers });
  }

  createUser(user: user): Observable<any> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.post<any>(`${this.createUserEndPoint}`, user, { headers });
  }
}
