import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AuthService } from './auth.service';
import { AssignedAquaculture } from '../interfaces/entities/aquaculture.interface';
import { PoolAdvancedDetails } from '../interfaces/entities/pool.interface';

@Injectable({
  providedIn: 'root'
})
export class CenterAdminService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  getAssignedAquaculture(): Observable<ApiResponse<AssignedAquaculture>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ApiResponse<AssignedAquaculture>>(
      `/center-admin/isAssigned`,
      { headers }
    );
  }


  createPool(poolData: any): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>('/center-admin/createPond', poolData, { headers });
  }

  getPoolofAquarium(): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/center-admin/ponds/`, { headers });
  }

  getPoolScientists(pondId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/center-admin/get-pond-scientists/${pondId}`, { headers });
  }

  getPoolbyId(id: string): Observable<ApiResponse<PoolAdvancedDetails>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<PoolAdvancedDetails>>(`/center-admin/dataPond/${id}`, { headers });
  }





}

