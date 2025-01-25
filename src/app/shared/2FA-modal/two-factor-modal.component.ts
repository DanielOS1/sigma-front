import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-two-fa-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
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
        <p class="description">Por favor, ingresa el código enviado a tu correo electrónico.</p>
        <form [formGroup]="codeForm">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Código de verificación</mat-label>
            <input matInput formControlName="code" placeholder="Ingresa el código">
            <mat-icon matSuffix>pin</mat-icon>
            <mat-error *ngIf="codeForm.get('code')?.errors?.['required']">
              El código es requerido
            </mat-error>
            <mat-error *ngIf="codeForm.get('code')?.errors?.['minlength']">
              El código debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>
        </form>
      </div>

      <div class="modal-actions">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!codeForm.valid"
          (click)="onSubmit()">
          <mat-icon>check</mat-icon>
          Verificar
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

      .description {
        text-align: center;
        color: #666;
        margin-bottom: 20px;
        font-size: 0.95rem;
      }

      mat-form-field {
        width: 100%;
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
export class TwoFactorModalComponent {
  @Output() codeSubmitted = new EventEmitter<string>();
  codeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TwoFactorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {rut: string}
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.codeForm.valid) {
      const code = this.codeForm.get('code')?.value;
      this.codeSubmitted.emit(code);
    }
  }
}