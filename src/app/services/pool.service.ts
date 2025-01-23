import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor(private http: HttpClient, private authService: AuthService) {}


  createPool(poolData: any): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>('/system-admin/createPond', poolData, { headers });
  }

  getPoolofAquarium(aquariumRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/system-admin/ponds/${aquariumRut}`, { headers });
  }
}
