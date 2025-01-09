import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    FormsModule, 
    CommonModule,
  ],
  template: `
    <h2 mat-dialog-title>Recuperar Contraseña</h2>
    <mat-dialog-content>
      <p>Ingrese su RUT para recuperar su contraseña.</p>
      <mat-form-field appearance="outline">
        <mat-label>RUT</mat-label>
        <input matInput [(ngModel)]="rut" type="text" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="accent" (click)="onRecover()">Recuperar</button>
    </mat-dialog-actions>
  `,
})
export class ForgotPasswordDialogComponent {
  rut: string = '';

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private authService: AuthService,
    private toastr: ToastrService // Para notificaciones
  ) {}

  onRecover(): void {
    if (!this.rut.trim()) {
      this.toastr.error('Por favor ingrese un RUT válido.');
      return;
    }

    this.authService.requestPasswordReset(this.rut).subscribe({
      next: (response) => {
        this.toastr.success('Solicitud enviada con éxito.');
        this.dialogRef.close();
      },
      error: (err) => {
        this.toastr.error('Error al procesar la solicitud.');
        console.error('Error:', err);
      },
    });
  }
}
