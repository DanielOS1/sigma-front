import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session-service.service'; 
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/entities/user.interface'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordDialogComponent } from '../components/forgot-password/forgot-password.component';
import { MatDialog } from '@angular/material/dialog';
import { DeviceService } from '../services/device.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginApiResponse } from '../types/response.interface';
import { TwoFactorModalComponent } from '../shared/2FA-modal/two-factor-modal.component';
import { NavigationService } from '../services/navigation.service';

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
    MatCheckboxModule,
    MatProgressSpinnerModule

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
  rememberMe: boolean = false;
  deviceId: string = '';
  isLoading: boolean = false;
  code2FA: string = '';
  constructor(
    private authService: AuthService,
    private sessionService: SessionService, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private deviceService: DeviceService,
    private navigationService: NavigationService
  ) {}

  /** Detecta cambios en el RUT y verifica si requiere contraseña */
  onRutChange(): void {
    if (this.isValidRutFormat(this.rut)) {
      if (this.rut !== this.previousRut) {
        this.previousRut = this.rut;
        const formattedRut = this.formatRut(this.rut);
  
        this.authService.checkShouldPassword(formattedRut).subscribe({
          next: (response: any) => {

            const requiresPassword = response?.data?.require_password;

            this.showPassword = requiresPassword;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al verificar el RUT:', err);
          },
        });
      }
    } else {
      this.showPassword = false;
      this.previousRut = '';
    }
  }
  
  openForgotPasswordDialog(): void {
    this.dialog.open(ForgotPasswordDialogComponent, {
      width: '400px', 
    });
  }

  /** Formatea el RUT automáticamente mientras el usuario escribe */
  onRutInput(): void {
    const rawValue = this.rut.replace(/[^\dkK]/g, ''); 
    const formattedValue = this.applyRutFormat(rawValue);
    this.rut = formattedValue;
    this.onRutChange();
  }

  /** Alterna la visibilidad de la contraseña */
  togglePasswordVisibility(): void {
    this.showPasswordIcon = !this.showPasswordIcon;
  }

  /** Envía los datos del formulario al servicio de autenticación */
  async onSumbit(): Promise<void> {
    this.isLoading = true;
    const formattedRut = this.formatRut(this.rut);
    this.deviceId = await this.deviceService.getDeviceId();
    
    if (!this.showPassword) {
      const loginDataTypeA: LoginTypeAdto = {
        rut: formattedRut,
        deviceId: this.deviceId
      };

      this.authService.loginPasswordLess(loginDataTypeA).subscribe({
        next: (response: LoginApiResponse) => {
          if(response.data.twoFactorEnabled)
            {
              this.toastr.success('Código de doble verificación enviado a tu correo.');
              this.open2FAModal();
            }
          this.handleLoginSuccess(response);
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Su RUT es incorrecto');
          this.isLoading = false;
        },
      });
    } else {
      const loginDataTypeB: LoginTypeBdto = {
        rut: formattedRut,
        password: this.password,
        deviceId: this.deviceId
      };

      this.authService.loginPassword(loginDataTypeB).subscribe({
        next: (response: LoginApiResponse) => {
          if(response.data.twoFactorEnabled)
            {
              this.toastr.success('Código de doble verificación enviado a tu correo.');
              this.open2FAModal();
            }
          this.handleLoginSuccess(response);
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Su contraseña es incorrecta');
          this.isLoading = false;
        },
      });
    }
  }

  /** Maneja el éxito en el login */
// components/login/login.component.ts
private handleLoginSuccess(response: any): void {
  try {
    const { accessToken, role } = response.data;

    // Manejo del token y sesión
    this.authService.setToken(accessToken, this.rememberMe);
    this.sessionService.startSessionMonitor();

    // Notificación de éxito
    this.toastr.success('Login exitoso', 'Éxito');

    // Navegación basada en rol
    this.navigationService.navigateByRole(role)
      .catch(error => {
        console.error('handleLoginSuccess: Error en navegación:', error);
        throw error; // Re-lanzar para ser capturado por el catch exterior
      });
  } catch (error) {
    console.error('handleLoginSuccess: Error general:', error);
    this.toastr.error('Error al procesar el login', 'Error');
  } finally {
    this.isLoading = false;
  }
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

  isFormValid(): boolean {
    const isRutValid = !!this.rut && this.isValidRutFormat(this.rut); 
    const isPasswordValid = this.showPassword ? this.password.trim().length > 0 : true;
    return isRutValid && isPasswordValid;
  }

  open2FAModal(): void {
    const dialogRef = this.dialog.open(TwoFactorModalComponent, {
      width: '400px',
      disableClose: true,
      data: { 
        rut: this.formatRut(this.rut)
      }
    });
  
    dialogRef.componentInstance.codeSubmitted.subscribe((code: string) => {
      this.code2FA = code;
      // Aquí enviamos el código al servicio
      this.authService.verify2FA(this.code2FA, this.formatRut(this.rut), this.deviceId).subscribe({
        next: (response) => {
          if (response.data?.accessToken) {
            dialogRef.close();
            this.handleLoginSuccess(response);
          } else {
            this.toastr.error('Código incorrecto');
          }
        },
        error: () => {
          this.toastr.error('Código incorrecto');
        }
      });
    });
  }

}
