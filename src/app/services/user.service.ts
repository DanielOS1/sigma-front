import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse, PasswordResetResponse, UsersApiResponse } from '../types/response.interface';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private myInfoEndPoint = "/auth/get-my-info"
  private createUserEndPoint = "/system-admin/register"
  private getUsersEndPoint = "/system-admin/show-users"
  private getResetPasswordRequestsEndPoint = "/system-admin/show-password-request"

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

  getResetPasswordRequests(page: number = 1): Observable<PasswordResetResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    return this.http.get<PasswordResetResponse>(`${this.getResetPasswordRequestsEndPoint}?page=${page}`, { headers });
  }

  approvePasswordReset(requestId: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ApiResponse<any>>(
      `/system-admin/reset-user-password?id=${requestId}`,
      { headers }
    );
  }

  changeUserDisabledStatus(rut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>(
      `/system-admin/change-disable-user/${rut}`,
      {},
      { headers }
    );
  }

  changeUserDeletedStatus(rut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>(
      `/system-admin/change-delete-user/${rut}`,
      {},
      { headers }
    );
  }
}
