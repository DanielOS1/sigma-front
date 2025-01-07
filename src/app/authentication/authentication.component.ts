import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session-service.service'; // Servicio para manejar la sesión
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

  constructor(
    private authService: AuthService,
    private sessionService: SessionService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  /** Detecta cambios en el RUT y verifica si requiere contraseña */
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
            
          },
        });
      }
      
    } else {
      this.showPassword = false;
      this.previousRut = '';
      
    }
  }

  /** Formatea el RUT automáticamente mientras el usuario escribe */
  onRutInput(): void {
    const rawValue = this.rut.replace(/[^\dkK]/g, ''); // Elimina caracteres no válidos
    const formattedValue = this.applyRutFormat(rawValue);
    this.rut = formattedValue;
    this.onRutChange();
  }

  /** Alterna la visibilidad de la contraseña */
  togglePasswordVisibility(): void {
    this.showPasswordIcon = !this.showPasswordIcon;
  }

  /** Envía los datos del formulario al servicio de autenticación */
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
      // Login sin contraseña
      this.authService.loginPasswordLess(loginDataTypeA).subscribe({
        next: (response: any) => {
          this.handleLoginSuccess(response);
        },
        error: () => {
          this.toastr.error('Su RUT es incorrecto');
        },
      });
    } else {
      // Login con contraseña
      this.authService.loginPassword(loginDataTypeB).subscribe({
        next: (response: any) => {
          this.handleLoginSuccess(response);
        },
        error: () => {
          this.toastr.error('Su contraseña es incorrecta');
        },
      });
    }
  }

  /** Maneja el éxito en el login */
  private handleLoginSuccess(response: any): void {
    const accessToken = response.data?.accessToken;

    this.authService.setToken(accessToken);
    this.sessionService.startSessionMonitor();

    console.log('Respuesta del servidor:', response);
    console.log('AccessToken recibido:', response.data?.accessToken);
    this.toastr.success('Login exitoso', 'Éxito');
    this.router.navigate(['/dashboard']);
  }

  /** Aplica el formato 10.123.456-7 al RUT */
  private applyRutFormat(rut: string): string {
    if (rut.length <= 1) {
      return rut;
    }

    const body = rut.slice(0, -1); 
    const verifier = rut.slice(-1); 
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    return `${formattedBody}-${verifier}`;
  }

  /** Verifica si el RUT tiene un formato válido */
  private isValidRutFormat(rut: string): boolean {
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/; 
    return rutRegex.test(rut);
  }

  /** Elimina los caracteres no válidos del RUT */
  private formatRut(rut: string): string {
    return rut.replace(/[.\-]/g, ''); 
  }
}
