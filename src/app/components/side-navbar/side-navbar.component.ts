import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { ApiResponse } from '../../types/response.interface';
import { adminSystem } from '../../interfaces/users/usersDto';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavComponent implements OnInit {
  isExpanded = true;

  user: adminSystem = {
    rut: '',
    name: '',
    lastName: '',
    email: '',
    role: 0,
  };

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private userService: UserService) {}

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<adminSystem>) => {
      this.user = user.data;
    });
    
  }

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
