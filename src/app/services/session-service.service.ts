import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private timeoutId: any;

  constructor(private authService: AuthService) {}

  startSessionMonitor(): void {
    this.clearSessionMonitor();
    const expiration = this.authService.getTokenExpiration();

    if (expiration) {
      const timeLeft = expiration - Date.now();

      if (timeLeft > 0) {
        this.timeoutId = setTimeout(() => {
          this.authService.clearToken();
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }, timeLeft);
      } else {
        this.authService.clearToken();
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
  }

  clearSessionMonitor(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
