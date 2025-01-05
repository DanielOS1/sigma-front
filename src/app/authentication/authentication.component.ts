import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginTypeAdto, LoginTypeBdto } from '../interfaces/loginDto';
import { Router } from '@angular/router';

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
    constructor(private authService: AuthService, private router: Router) { }
    onRutChange(): void {
      const rutFocus = '333333333';
      this.showPassword = this.rut === rutFocus;
    }
    onSumbit(): void {
      console.log(this.password)
      const loginDataTypeA: LoginTypeAdto = {
        rut: this.rut,
        deviceId: navigator.userAgent.slice(0, 25),
      }

      const loginDataTypeB: LoginTypeBdto = {
        rut: this.rut,
        password: this.password,
        deviceId: navigator.userAgent.slice(0, 25),
      }

      if (!this.showPassword) {
        this.authService.loginPasswordLess(loginDataTypeA).subscribe({
          next: (response: LoginTypeAdto) => { 
            console.log('Respuesta del login:', response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al iniciar sesión:', error);
          }
        });
      } else {
        this.authService.loginPassword(loginDataTypeB).subscribe({
          next: (response: LoginTypeBdto) => { 
            console.log('Respuesta del login:', response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al iniciar sesión:', error);
          }
        });
      }
    }
 }
