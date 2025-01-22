import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse } from '../types/response.interface';
import { RolePipe } from '../pipes/role.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuditLog } from '../interfaces/users/audits.interface';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordModalComponent } from '../shared/reset-password-modal/reset-password-modal.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { UserRole } from '../interfaces/users/roles.enum';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, RolePipe, MatIconModule, MatDividerModule, MatPaginatorModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = {
    rut: '',
    name: '',
    lastName: '',
    email: '',
    role: 0,
    isActive: false,
    isDeleted: false,
  };

  audits: AuditLog[] = [];
  totalAudits: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  
  userType: string = '';

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<User>) => {
      this.user = user.data;
    });

    this.loadAudits();
  }

  loadAudits(page: number = 0) {
    this.userService.getAudits(page + 1, this.pageSize).subscribe({
      next: (response: AuditLog[]) => {
        console.log('Audits received:', response);
        this.audits = response;
        this.totalAudits = response.length;
      },
      error: (error) => {
        console.error('Error loading audits:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAudits(this.currentPage);
  }

  openResetPasswordModal(): void {
    const dialogRef = this.dialog.open(ResetPasswordModalComponent, { 
      width: '400px',
      disableClose: true,
      data: { 
        rut: this.user.rut,
        isSystemAdmin: this.user.role === UserRole.SYSTEM_ADMIN 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // La solicitud fue enviada exitosamente
        console.log('Solicitud de cambio de contraseña enviada');
      }
    });
  }

  open2FASetup(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Activar Doble Verificación',
        message: '¿Estás seguro de que deseas activar la doble verificación?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes llamar a tu servicio para activar la doble verificación
        this.authService.request2FASetup().subscribe({
          next: () => {
            console.log('Doble verificación activada con éxito');
            this.toastr.success('Doble verificación activada con éxito');
          },
          error: (error) => {
            console.error('Error al activar la doble verificación:', error);
            this.toastr.error('Error al activar la doble verificación');
          }
        });
      }
    });
  }
}
