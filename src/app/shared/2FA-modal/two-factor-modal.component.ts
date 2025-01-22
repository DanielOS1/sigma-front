import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-two-fa-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Verificación en dos pasos</h2>
    <mat-dialog-content>
      <p>Por favor, ingresa el código enviado a tu correo electrónico.</p>
      <form [formGroup]="codeForm">
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Código de verificación</mat-label>
          <input matInput formControlName="code" placeholder="Ingresa el código">
          <mat-error *ngIf="codeForm.get('code')?.errors?.['required']">
            El código es requerido
          </mat-error>
          <mat-error *ngIf="codeForm.get('code')?.errors?.['minlength']">
            El código debe tener al menos 6 caracteres
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="!codeForm.valid"
        (click)="onSubmit()">
        Verificar
      </button>
    </mat-dialog-actions>
  `
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