import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';

@Injectable({
  providedIn: 'root'
})
export class AquacultureService {
  constructor(private http: HttpClient) {}

  getAllAquacultures(page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<any>>('/system-admin/all', { headers, params });
  }

  createAquaculture(aquacultureData: any): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>('/system-admin/create-aquaculture', aquacultureData, { headers });
  }
}
