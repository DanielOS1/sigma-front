import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../interfaces/users/roles.enum';
import { ApiResponse } from '../../types/response.interface';
import { User } from '../../interfaces/users/usersDto';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class AdminSystemSideNavComponent implements OnInit {
  isExpanded = true;
  isUserManagementExpanded = false;
  roles = UserRole;
  user: User = {
    rut: '',
    name: '',
    lastName: '',
    email: '',
    role: 0,
    isActive: false,
    isDeleted: false,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<User>) => {
      this.user = user.data;
    });
  }

  getRoleDisplay(role: number): string {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return 'Administrador del Sistema';
      case UserRole.OWNER:
        return 'Dueño';
      case UserRole.SCIENTIST:
        return 'Científico';
      case UserRole.AQUACULTURE_ADMIN:
        return 'Administrador Acuícola';
      default:
        return 'Usuario';
    }
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        this.toastr.success('Sesión cerrada con éxito.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.toastr.error('Error al cerrar sesión.');
        console.error('Error en logout:', err);
      },
    });
  }

  goToProfile(): void {
    console.log('goToProfile');
    this.router.navigate(['/profile']);
  }

  goToSystemAdmin(): void {
    this.router.navigate(['/system-admin']);
  }

  toggleUserManagement(): void {
    this.isUserManagementExpanded = !this.isUserManagementExpanded;
  }

  goToCreateUser(): void {
    this.router.navigate(['/system-admin/create-user']);
  }

  goToResetPassword(): void {
    this.router.navigate(['/system-admin/reset-password']);
  }

  goToAquacultureManage(): void {
    this.router.navigate(['/system-admin/aquaculture-manage']);
  }
}
