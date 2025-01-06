import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  rut: string = '';
  previousRut: string = '';
  password: string = '';
  showPassword: boolean = false;
  showPasswordIcon: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  onRutChange(): void {
    console.log('RUT ingresado:', this.rut);

    // Evita realizar una solicitud si el RUT no ha cambiado significativamente
    if (this.rut !== this.previousRut && this.rut.length > 8) {
      console.log('Verificando si el RUT requiere contraseña...');
      this.previousRut = this.rut;

      this.authService.checkShouldPassword(this.rut).subscribe({
        next: (requiresPassword: boolean) => {
          console.log('Respuesta del servidor (requiere contraseña):', requiresPassword);
          this.showPassword = requiresPassword;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al verificar el RUT:', err);
          if (this.previousRut !== this.rut) {
            this.toastr.error('Error al verificar el RUT');
          }
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPasswordIcon = !this.showPasswordIcon;
  }

  onSumbit(): void {
    console.log('Formulario enviado. Contraseña:', this.password);
    const loginDataTypeA: LoginTypeAdto = {
      rut: this.rut,
      deviceId: navigator.userAgent.slice(0, 25),
    };

    const loginDataTypeB: LoginTypeBdto = {
      rut: this.rut,
      password: this.password,
      deviceId: navigator.userAgent.slice(0, 25),
    };

    if (!this.showPassword) {
      this.authService.loginPasswordLess(loginDataTypeA).subscribe({
        next: (response: LoginTypeAdto) => {
          console.log('Respuesta del login:', response);
          this.toastr.success('Login exitoso', 'Éxito');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.toastr.error('Su RUT es incorrecto');
        },
      });
    } else {
      this.authService.loginPassword(loginDataTypeB).subscribe({
        next: (response: LoginTypeBdto) => {
          console.log('Respuesta del login:', response);
          this.toastr.success('Login exitoso', 'Éxito');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.toastr.error('Su contraseña es incorrecta');
        },
      });
    }
  }
}
