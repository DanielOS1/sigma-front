import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timeoutId: any;

  constructor(private authService: AuthService) {}

  startSessionMonitor(): void {
    this.clearSessionMonitor();
    const expiration = localStorage.getItem('token_expiration');
    if (expiration) {
      const timeLeft = +expiration - Date.now();
      this.timeoutId = setTimeout(() => {
        this.authService.clearToken();
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }, timeLeft);
    }
  }

  clearSessionMonitor(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
