import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AquacultureDetailResponse } from '../interfaces/aquaculture/aquaculture.interface';

interface AAqCad {
  rutAq: string;
  rut: string;
}

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

    return this.http.get<ApiResponse<any>>('/system-admin/all-aq', { headers, params });
  }

  createAquaculture(aquacultureData: any): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>('/system-admin/create-aquaculture', aquacultureData, { headers });
  }

  getAquacultureByRut(rut: string): Observable<AquacultureDetailResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<AquacultureDetailResponse>(
      `/system-admin/${rut}`,
      { headers }
    );
  }

  assignAqAdmin(centerAdminRut: string, aquacultureRut: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    const body: AAqCad = {
      rutAq: aquacultureRut,
      rut: centerAdminRut
    };
  
    return this.http.post<ApiResponse<any>>(
      '/system-admin/assingCenterAdminAquaculture',
      body,
      { headers }
    );
  }


}
