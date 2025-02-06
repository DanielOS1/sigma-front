import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AuthService } from './auth.service';
import { PoolAdvancedDetails, PoolDetails } from '../interfaces/entities/pool.interface';
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

    return this.http.post<ApiResponse<any>>('/center-admin/createPond', poolData, { headers });
  }

  getPoolofAquarium(aquariumRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/system-admin/ponds/${aquariumRut}`, { headers });
  }

  getPoolbyId(id: string): Observable<ApiResponse<PoolAdvancedDetails>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<PoolAdvancedDetails>>(`/system-admin/dataPond/${id}`, { headers });
  }


  assignScientistToPool(poolId: string, scientistRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiResponse<any>>(`/center-admin/assign-scientist-pond/${scientistRut}/${poolId}`, {}, { headers });
  }


  removeScientistFromPool(poolId: string, scientistRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiResponse<any>>(`/center-admin/remove-assigned-scientist-pond/${scientistRut}/${poolId}`, {}, { headers });
  }

  assignOwnerToPool(idPond: string, rutOwner: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiResponse<any>>(`/center-admin/assign-owner-pond`, {idPond, rutOwner}, { headers });
  }

  removeOwnerFromPool(poolId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<ApiResponse<any>>(`/center-admin/unassign-owner-pond/${poolId}`, {}, { headers });
  }

  getPoolScientists(poolId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/center-admin/get-pond-scientists/${poolId}`, { headers });
  }
}
