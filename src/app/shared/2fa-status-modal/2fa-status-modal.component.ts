import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-2fa-status-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          <mat-icon>security</mat-icon>
          Verificación en dos pasos
        </h2>
      </div>

      <div class="modal-content">
        <div class="status-indicator">
          <mat-icon [class.enabled]="data.is2FAEnabled">
            {{ data.is2FAEnabled ? 'security' : 'security_off' }}
          </mat-icon>
          <div class="status-text">
            <h3>Estado: {{ data.is2FAEnabled ? 'Activado' : 'Desactivado' }}</h3>
            <p>La verificación en dos pasos {{ data.is2FAEnabled ? 'está activa' : 'no está activa' }} 
               en tu cuenta.</p>
          </div>
        </div>

        <div class="info-text">
          <p *ngIf="!data.is2FAEnabled">
            Al activar la verificación en dos pasos, recibirás un código por correo 
            electrónico cada vez que inicies sesión.
          </p>
          <p *ngIf="data.is2FAEnabled">
            La verificación en dos pasos ayuda a proteger tu cuenta requiriendo un 
            código adicional al iniciar sesión.
          </p>
        </div>
      </div>

      <div class="modal-actions">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button 
          mat-raised-button 
          [color]="data.is2FAEnabled ? 'warn' : 'primary'"
          (click)="toggle2FA()">
          <mat-icon>{{ data.is2FAEnabled ? 'lock_open' : 'lock' }}</mat-icon>
          {{ data.is2FAEnabled ? 'Desactivar' : 'Activar' }} verificación
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      padding: 24px;
      min-width: 320px;
      max-width: 400px;
    }

    .modal-header {
      margin-bottom: 24px;
      text-align: center;

      h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;
        color: #333;
        
        mat-icon {
          color: #2196f3;
        }
      }
    }

    .modal-content {
      margin-bottom: 24px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 16px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #94a3b8;

        &.enabled {
          color: #2196f3;
        }
      }

      .status-text {
        h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        p {
          margin: 4px 0 0;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }

    .info-text {
      padding: 0 8px;
      
      p {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0;
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    @media (max-width: 480px) {
      .modal-container {
        padding: 16px;
      }

      .modal-header h2 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class TwoFAStatusModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TwoFAStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { is2FAEnabled: boolean }
  ) {}

  toggle2FA(): void {
    this.dialogRef.close(true); // true indica que se debe cambiar el estado
  }
}
