import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { AuthService } from './auth.service';
import { AssignedAquaculture } from '../interfaces/entities/aquaculture.interface';
import { PoolAdvancedDetails } from '../interfaces/entities/pool.interface';
import { SensorFormat } from '../interfaces/entities/sensor.interface';

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


  getSensorsFromPond(id: string): Observable<ApiResponse<SensorFormat[]>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<SensorFormat[]>>(`/center-admin/get-sensors-from-pond/${id}`, { headers });
  }

  getSensorDetails(sensorId: string, all: boolean = true, active: boolean = true): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    const params = new HttpParams()
      .set('all', all.toString())
    
    return this.http.get<ApiResponse<any>>(
      `/center-admin/get-sensor-details/${sensorId}`,
      { headers, params }
    );
  }

  desactivateSensor(sensorId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.patch<ApiResponse<any>>(
      `/center-admin/deactivate-sensor/${sensorId}`, 
      {}, // cuerpo vacío
      { headers } // headers como tercer parámetro
    );
  }



  activateSensor(sensorId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.patch<ApiResponse<any>>(
      `/center-admin/activate-sensor/${sensorId}`, 
      {}, // cuerpo vacío
      { headers } // headers como tercer parámetro
    );
  }
  

}

