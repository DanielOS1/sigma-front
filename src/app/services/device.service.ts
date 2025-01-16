import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private fingerprintPromise!: Promise<FingerprintJS.Agent>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
}
