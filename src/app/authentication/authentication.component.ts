import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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

    onRutChange(): void {
      const rutFocus = '11.111.111-1';
      this.showPassword = this.rut === rutFocus;
    }

}
