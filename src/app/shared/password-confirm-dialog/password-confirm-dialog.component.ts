import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule    ],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          <mat-icon>lock</mat-icon>
          Confirmar Contraseña
        </h2>
      </div>

      <div class="modal-content">
        <p>Por favor, ingresa tu contraseña para continuar</p>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" [(ngModel)]="password">
        </mat-form-field>
      </div>

      <div class="modal-actions">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button 
          mat-raised-button 
          color="primary"
          [disabled]="!password"
          [mat-dialog-close]="password">
          Confirmar
        </button>
      </div>
    </div>
  `,
  styles: [/* ... estilos similares a otros modales ... */]
})
export class PasswordConfirmDialogComponent {
  password: string = '';
} 