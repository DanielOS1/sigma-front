import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('Sesión cerrada con éxito.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.toastr.error('Error al cerrar sesión.');
        console.error('Error en logout:', err);
      },
    });
  }
}
