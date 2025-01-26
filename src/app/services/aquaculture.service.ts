import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AquacultureDetailResponse } from '../interfaces/aquaculture/aquaculture.interface';
import { AuthService } from './auth.service';

interface AAqCad {
  rutAq: string;
  rut: string;
}

@Injectable({
  providedIn: 'root'
})


export class AquacultureService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllAquacultures(page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<any>>('/system-admin/all-aq', { headers, params });
  }

  createAquaculture(aquacultureData: any): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>('/system-admin/create-aquaculture', aquacultureData, { headers });
  }

  getAquacultureByRut(rut: string): Observable<AquacultureDetailResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<AquacultureDetailResponse>(
      `/system-admin/aquacultures/${rut}`,
      { headers }
    );
  }

  assignAqAdmin(centerAdminRut: string, aquacultureRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
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

  assignScientist(rut: string, rutScientist: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiResponse<any>>(
      `/system-admin/assign-scientist-aq/${rutScientist}/${rut}`,
      {},
      { headers }
    );
  }

  removeAquacultureAdmin(rut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<ApiResponse<any>>(`/system-admin/removeCenterAdmin/${rut}`, {}, { headers });
  }

  getAqScientists(rut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/center-admin/get-aq-scientists/${rut}`, { headers });
  }

  removeScientist(aquacultureRut: string, scientistRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<ApiResponse<any>>(`/center-admin/remove-scientist-aq/${aquacultureRut}/${scientistRut}`, { headers });
  }

}
