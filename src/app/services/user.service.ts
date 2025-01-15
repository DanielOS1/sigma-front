import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse, UsersApiResponse } from '../types/response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private myInfoEndPoint = "/auth/get-my-info"
  private createUserEndPoint = "/system-admin/register"
  private getUsersEndPoint = "/system-admin/show-users"

  getUser(): Observable<any> {

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.get<any>(`${this.myInfoEndPoint}`, { headers });
  }

  createUser(user: User): Observable<any> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.post<any>(`${this.createUserEndPoint}`, user, { headers });
  }

  getUsers(page: number = 1): Observable<UsersApiResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    return this.http.get<UsersApiResponse>(`${this.getUsersEndPoint}?page=${page}`, { headers });
  }
}
