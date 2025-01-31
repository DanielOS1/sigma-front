import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSensor, Sensor, updateSensor } from '../interfaces/entities/sensor.interface';
import { AuthService } from './auth.service';
import { ApiResponse } from '../types/response.interface';

@Injectable({
  providedIn: 'root'
})

export class SensorService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  createSensor(sensor: CreateSensor): Observable<ApiResponse<any>> {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ApiResponse<any>>(`/sensors`, sensor, { headers });
  }

  getSensorDetails(sensorId: string): Observable<ApiResponse<Sensor>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ApiResponse<Sensor>>(`/sensors/${sensorId}`, { headers });
  }

  updateSensor(sensorId: string, sensor: updateSensor): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<ApiResponse<any>>(`/sensors/${sensorId}/update`, sensor, { headers });
  }
  
  desactivateSensor(sensorId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<ApiResponse<any>>(`/sensors/${sensorId}/desactivate`, { headers });
  }

  activateSensor(sensorId: string): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<ApiResponse<any>>(`/sensors/${sensorId}/activate`, { headers });
  }

  

}
