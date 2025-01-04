import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginTypeAdto } from '../interfaces/logintypeAdto';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [MatCardModule,MatInputModule, MatButtonModule,CommonModule, FormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
    rut: string  = '';
    password: string = '';
    showPassword: boolean = false;

    constructor(private authService: AuthService) { }

    onRutChange(): void {
      const rutFocus = '11.111.111-1';
      this.showPassword = this.rut === rutFocus;
    }

    onSumbit(): void {

      const loginData = {
        rut: this.rut,
        deviceId: navigator.userAgent.slice(0, 25),
      }

      this.authService.loginPasswordLess(loginData).subscribe({
        next: (response: LoginTypeAdto) => { 
          console.log('Respuesta del login:', response);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
        }
      });
    }
  }
