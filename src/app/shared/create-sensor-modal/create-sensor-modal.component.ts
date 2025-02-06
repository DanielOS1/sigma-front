import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SensorType } from '../../interfaces/entities/sensor.interface';

@Component({
  selector: 'app-create-sensor-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="create-sensor-modal">
      <h2 mat-dialog-title>Crear Nuevo Sensor de {{data.sensorType}}</h2>
      
      <mat-dialog-content>
        <div class="sensor-form">
          <!-- Thresholds -->
          <div class="threshold-fields">
            <mat-form-field appearance="outline">
              <mat-label>Umbral Mínimo</mat-label>
              <input matInput type="number" [(ngModel)]="sensorData.thresholdMin">
              <mat-icon matPrefix>minimize</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Umbral Máximo</mat-label>
              <input matInput type="number" [(ngModel)]="sensorData.thresholdMax">
              <mat-icon matPrefix>maximize</mat-icon>
            </mat-form-field>
          </div>

          <!-- Sampling Frequency -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Frecuencia de Muestreo (minutos)</mat-label>
            <input matInput type="number" [(ngModel)]="sensorData.samplingFrequency" min="1">
            <mat-icon matPrefix>schedule</mat-icon>
          </mat-form-field>

          <!-- Position -->
          <div class="position-fields">
            <mat-form-field appearance="outline">
              <mat-label>Posición X</mat-label>
              <input matInput type="number" [(ngModel)]="sensorData.xPosition" min="0" required>
              <mat-icon matPrefix>straighten</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Posición Y</mat-label>
              <input matInput type="number" [(ngModel)]="sensorData.yPosition" min="0" required>
              <mat-icon matPrefix>straighten</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Posición Z</mat-label>
              <input matInput type="number" [(ngModel)]="sensorData.zPosition" min="0" required>
              <mat-icon matPrefix>straighten</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" 
                [disabled]="!isFormValid()">
          Crear Sensor
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .create-sensor-modal {
      padding: 1rem;
      
      h2 {
        color: #1e293b;
        margin-bottom: 1.5rem;
      }

      .sensor-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .threshold-fields, .position-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .full-width {
          width: 100%;
        }

        mat-form-field {
          width: 100%;
        }
      }
    }

    mat-dialog-actions {
      padding: 1rem 0;
      gap: 1rem;
    }
  `]
})
export class CreateSensorModalComponent {
  sensorData: any;

  constructor(
    public dialogRef: MatDialogRef<CreateSensorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sensorType: SensorType, pondId: string }
  ) {
    this.sensorData = {
      type: this.data.sensorType,
      thresholdMin: null,
      thresholdMax: null,
      samplingFrequency: 5,
      xPosition: 0,
      yPosition: 0,
      zPosition: 0,
      pondId: this.data.pondId
    };
  }

  isFormValid(): boolean {
    return (
      this.sensorData.xPosition >= 0 &&
      this.sensorData.yPosition >= 0 &&
      this.sensorData.zPosition >= 0 &&
      this.sensorData.pondId !== ''
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.sensorData);
    }
  }
}