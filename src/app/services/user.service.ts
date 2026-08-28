import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/entities/user.interface';
import { ApiResponse, PasswordResetResponse, UsersApiResponse } from '../types/response.interface';
import { AuthService } from '../services/auth.service';
import { AuditResponse } from '../interfaces/entities/user.interface';


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

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.get<any>(`${this.myInfoEndPoint}`, { headers });
  }

  createUser(user: User): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.post<any>(`${this.createUserEndPoint}`, user, { headers });
  }

  getUsers(page: number = 1): Observable<UsersApiResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    return this.http.get<UsersApiResponse>(`${this.getUsersEndPoint}?page=${page}`, { headers });
  }

  getResetPasswordRequests(page: number = 1): Observable<PasswordResetResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });
    return this.http.get<PasswordResetResponse>(`${this.getResetPasswordRequestsEndPoint}?page=${page}`, { headers });
  }

  approvePasswordReset(requestId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
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

  getAudits(page: number = 1, limit: number = 5): Observable<AuditResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('performedBy', this.authService.getDecodedToken()?.rut ?? '');

    return this.http.get<AuditResponse[]>(
      `/audit`,
      {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }
  
  
}

