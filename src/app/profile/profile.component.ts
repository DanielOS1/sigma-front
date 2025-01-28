import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse } from '../types/response.interface';
import { RolePipe } from '../pipes/role.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuditLog } from '../interfaces/users/audits.interface';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordModalComponent } from '../shared/reset-password-modal/reset-password-modal.component';
import { UserRole } from '../interfaces/users/roles.enum';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TwoFAStatusModalComponent } from '../shared/2fa-status-modal/2fa-status-modal.component';
import { BaseUser } from '../interfaces/users/usersDto';
import { PasswordConfirmDialogComponent } from '../shared/password-confirm-dialog/password-confirm-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    RolePipe, 
    MatIconModule, 
    MatDividerModule, 
    MatPaginatorModule, 
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: BaseUser | null = null;
  isLoading: boolean = true;
  audits: AuditLog[] = [];
  totalAudits: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20];
  currentPage: number = 0;
  is2FAEnabled: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAudits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: ApiResponse<User>) => {
          if (user?.data) {
            console.log('Datos de usuario recibidos:', user.data);
            this.user = user.data;
          } else {
            console.error('Datos de usuario inválidos:', user);
            this.toastr.error('Error al cargar datos del usuario');
          }
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
          this.toastr.error('Error al cargar el perfil');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  loadAudits(page: number = 1): void {
    this.isLoading = true;
    this.userService.getAudits(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (audits: AuditLog[]) => {
          this.audits = audits;
          this.totalAudits = 100;
        },
        error: (error) => {
          console.error('Error loading audits:', error);
          this.toastr.error('Error al cargar el historial de actividad');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAudits(this.currentPage + 1);
  }

  openResetPasswordModal(): void {
    if (!this.user) {
      this.toastr.error('Error al cargar los datos del usuario');
      return;
    }

    const dialogRef = this.dialog.open(ResetPasswordModalComponent, { 
      width: '400px',
      disableClose: true,
      data: { 
        rut: this.user.rut,
        isSystemAdmin: this.user.role === UserRole.SYSTEM_ADMIN 
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          console.log('Solicitud de cambio de contraseña enviada');
          this.toastr.success('Solicitud de cambio de contraseña enviada');
        }
      });
  }

  openSecuritySettings(): void {
    if (!this.user) {
      this.toastr.error('Error al cargar los datos del usuario');
      return;
    }

    const dialogRef = this.dialog.open(TwoFAStatusModalComponent, {
      data: { is2FAEnabled: this.user.twoStepAuth },
      width: '100%',
      maxWidth: '400px'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          if (this.user?.twoStepAuth) {
            const passwordDialog = this.dialog.open(PasswordConfirmDialogComponent);
            passwordDialog.afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(password => {
                if (password) {
                  this.authService.disable2FA(password).subscribe({
                    next: () => {
                      if (this.user) {
                        this.user.twoStepAuth = false;
                        this.toastr.success('Verificación en dos pasos desactivada');
                      }
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
                if (this.user) {
                  this.user.twoStepAuth = true;
                  this.toastr.success('Verificación en dos pasos activada');
                }
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