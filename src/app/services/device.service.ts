import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../types/response.interface';
import { Observable } from 'rxjs';

export interface Device {
  id: string;
  deviceId: string;
  lastUsed: string;
}

interface DeviceResponse {
  message: string;
  data: Device[];
  success: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private fingerprintPromise!: Promise<FingerprintJS.Agent>;
  private showMyDevicesEndpoint = '/auth/show-my-devices';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.fingerprintPromise = FingerprintJS.load();
    }
  }

  async getDeviceId(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return 'server-side';
    }
    const fp = await this.fingerprintPromise;
    const result = await fp.get();
    return result.visitorId;
  }

  getMyDevices(): Observable<DeviceResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<DeviceResponse>(this.showMyDevicesEndpoint, { headers });
  }
}
