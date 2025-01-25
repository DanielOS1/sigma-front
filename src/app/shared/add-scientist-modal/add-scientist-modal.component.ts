import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-scientist-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          <mat-icon>science</mat-icon>
          Agregar Científico
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="modal-content">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>RUT del Científico</mat-label>
          <input matInput [(ngModel)]="scientistRut" placeholder="Ingrese RUT">
          <mat-icon matSuffix>badge</mat-icon>
        </mat-form-field>
      </div>

      <div class="modal-actions">
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-raised-button 
                color="primary" 
                [disabled]="!scientistRut"
                (click)="addScientist()">
          Agregar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      padding: 24px;
      min-width: 400px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        
        mat-icon {
          color: #2196f3;
        }
      }
    }

    .modal-content {
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class AddScientistModalComponent {
  scientistRut: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddScientistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { aquacultureRut: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  addScientist(): void {
    if (this.scientistRut) {
      this.dialogRef.close(this.scientistRut);
    }
  }
}
