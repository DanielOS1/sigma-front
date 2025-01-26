import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface DialogData {
  type: 'scientist' | 'owner' | 'admin';
  aquacultureRut?: string;
  poolId?: string;
}

@Component({
  selector: 'app-assign-personnel-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
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
          <mat-icon>{{ getIcon() }}</mat-icon>
          Asignar {{ getTitle() }}
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="modal-content">
        <p class="description">
          Ingrese el RUT del {{ getTitle() }} que desea asignar.
        </p>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>RUT</mat-label>
          <input matInput [(ngModel)]="rut" placeholder="Ingrese RUT">
          <mat-icon matSuffix>badge</mat-icon>
        </mat-form-field>
      </div>

      <div class="modal-actions">
        <button mat-button (click)="close()">Cancelar</button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!rut"
          (click)="assign()">
          <mat-icon>person_add</mat-icon>
          Asignar
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        display: flex;
        align-items: center;
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
export class AssignPersonnelModalComponent {
  rut: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignPersonnelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  assign(): void {
    if (this.rut) {
      this.dialogRef.close(this.rut);
    }
  }

  getIcon(): string {
    switch(this.data.type) {
      case 'scientist': return 'science';
      case 'admin': return 'admin_panel_settings';
      default: return 'person';
    }
  }

  getTitle(): string {
    switch(this.data.type) {
      case 'scientist': return 'Científico';
      case 'admin': return 'Administrador';
      default: return 'Dueño';
    }
  }
} 