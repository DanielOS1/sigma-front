import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session-service.service'; // Nuevo servicio para manejar la sesión
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  rut: string = '';
  password: string = '';
  showPassword: boolean = false;
  showPasswordIcon: boolean = false;
  previousRut: string = '';
  hasShownInvalidRutAlert: boolean = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService, // Servicio para manejar tokens y monitoreo
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  onRutChange(): void {
    if (this.isValidRutFormat(this.rut)) {
      if (this.rut !== this.previousRut) {
        this.previousRut = this.rut;
        const formattedRut = this.formatRut(this.rut);

        this.authService.checkShouldPassword(formattedRut).subscribe({
          next: (requiresPassword: boolean) => {
            this.showPassword = requiresPassword;
            this.cdr.detectChanges();
          },
          error: () => {
            this.toastr.error('Error al verificar el RUT');
          },
        });
      }
    } else {
      this.showPassword = false;
      this.previousRut = ''; 
    }
  }

  togglePasswordVisibility(): void {
    this.showPasswordIcon = !this.showPasswordIcon;
  }

  onSumbit(): void {
    const formattedRut = this.formatRut(this.rut);

    const loginDataTypeA: LoginTypeAdto = {
      rut: formattedRut,
      deviceId: navigator.userAgent.slice(0, 25),
    };

    const loginDataTypeB: LoginTypeBdto = {
      rut: formattedRut,
      password: this.password,
      deviceId: navigator.userAgent.slice(0, 25),
    };

    if (!this.showPassword) {
      this.authService.loginPasswordLess(loginDataTypeA).subscribe({
        next: (response: any) => {
          this.handleLoginSuccess(response);
        },
        error: () => {
          this.toastr.error('Su RUT es incorrecto');
        },
      });
    } else {
      this.authService.loginPassword(loginDataTypeB).subscribe({
        next: (response: any) => {
          console.log('Respuesta del login:', response);
          this.handleLoginSuccess(response);
        },
        error: () => {
          this.toastr.error('Su contraseña es incorrecta');
        },
      });
    }
  }

  private handleLoginSuccess(response: any): void {
    const { accessToken, expiration } = response; 
    //this.authService.setToken(accessToken, expiration); 
    this.sessionService.startSessionMonitor(); 
    this.toastr.success('Login exitoso', 'Éxito');
    this.router.navigate(['/dashboard']);
  }

  private isValidRutFormat(rut: string): boolean {
    const rutRegex = /^(\d{1,2}\.\d{3}\.\d{3}-\d{1})$/;
    return rutRegex.test(rut);
  }

  private formatRut(rut: string): string {
    return rut.replace(/[.\-]/g, '');
  }
}
