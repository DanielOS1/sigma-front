import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss']
})  
export class ResetPasswordModalComponent {
  rut: string = '';
  isSystemAdmin: boolean = false;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ResetPasswordModalComponent>,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { rut: string, isSystemAdmin: boolean }
  ) {
    this.rut = data.rut;
    this.isSystemAdmin = data.isSystemAdmin;
  }

  onConfirm(): void {
    this.isLoading = true;
    this.authService.requestPasswordReset(this.rut).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Solicitud de cambio de contraseña enviada exitosamente');
          this.authService.clearToken();
          this.router.navigate(['/login']); 
          this.dialogRef.close(true);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error al enviar la solicitud');
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}