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
import { TwoFAStatusModalComponent } from '../shared/2fa-status-modal/2fa-status-modal.component';
import { BaseUser } from '../interfaces/users/usersDto';
import { PasswordConfirmDialogComponent } from '../shared/password-confirm-dialog/password-confirm-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, RolePipe, MatIconModule, MatDividerModule, MatPaginatorModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user!: BaseUser;

  audits: AuditLog[] = [];
  totalAudits: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  is2FAEnabled: boolean = false;
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

  openSecuritySettings(): void {
    const dialogRef = this.dialog.open(TwoFAStatusModalComponent, {
      data: { is2FAEnabled: this.user.twoStepAuth },
      width: '100%',
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user.twoStepAuth) {
          // Abre un nuevo diálogo para pedir la contraseña
          const passwordDialog = this.dialog.open(PasswordConfirmDialogComponent);
          passwordDialog.afterClosed().subscribe(password => {
            if (password) {
              this.authService.disable2FA(password).subscribe({
                next: () => {
                  this.user.twoStepAuth = false;
                  this.toastr.success('Verificación en dos pasos desactivada');
                },
                error: (error) => {
                  console.error('Error al desactivar 2FA:', error);
                  this.toastr.error('Error al desactivar la verificación en dos pasos');
                }
              });
            }
          });
        } else {
          this.authService.request2FASetup().subscribe({
            next: () => {
              this.user.twoStepAuth = true;
              this.toastr.success('Verificación en dos pasos activada');
            },
            error: (error) => {
              console.error('Error al activar 2FA:', error);
              this.toastr.error('Error al activar la verificación en dos pasos');
            }
          });
        }
      }
    });
  }
}
