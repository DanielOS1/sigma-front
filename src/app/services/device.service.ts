import { Injectable } from '@angular/core';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private fingerprintPromise: Promise<FingerprintJS.Agent>;

  constructor() {
    this.fingerprintPromise = FingerprintJS.load(); 
  }

  async getDeviceId(): Promise<string> {
    const fp = await this.fingerprintPromise;
    const result = await fp.get(); 
    return result.visitorId; 
  }
}
