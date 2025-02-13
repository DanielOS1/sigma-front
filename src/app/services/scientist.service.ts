import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../types/response.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AquacultureAssignmentsScientist, AquacultureAssignmentsScientistDetails } from '../interfaces/entities/aquaculture.interface';
import { PondAssignedScientistDetails } from '../interfaces/entities/pool.interface';
@Injectable({
  providedIn: 'root'
})
export class ScientistService {

  constructor(private http: HttpClient, private authService: AuthService) { } 

  getAquacultureAssignments(): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/scientist/my-aq-assigments`, { headers });
  }

  getAquaculturePools(aquacultureRut: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<any>>(`/center-admin/get-aquaculture-pools/${aquacultureRut}`, { headers });
  }

  getPoolSensors(poolId: string): Observable<ApiResponse<AquacultureAssignmentsScientist>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<AquacultureAssignmentsScientist>>(`/center-admin/get-pool-sensors/${poolId}`, { headers });
  }

  getAquacultureDetails(aquacultureId: string): Observable<ApiResponse<AquacultureAssignmentsScientistDetails>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<AquacultureAssignmentsScientistDetails>>(`/scientist/get-aq-details/${aquacultureId}`, { headers });
  }

  getPondDetails(pondId: string): Observable<ApiResponse<PondAssignedScientistDetails>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<PondAssignedScientistDetails>>(`/scientist/dataPond/${pondId}`, { headers });
  }
}
