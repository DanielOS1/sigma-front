import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SensorType } from '../../interfaces/entities/sensor.interface';
import { SensorService } from '../../services/sensor.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SensorTypePipe } from '../../pipes/sensor-type.pipe';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sensor-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    SensorTypePipe,
    MatProgressSpinnerModule
  ],
  template: `
    <ng-container *ngIf="sensor; else loading">
      <h2 mat-dialog-title>
        <mat-icon>{{getSensorIcon(sensor.type)}}</mat-icon>
        Sensor de {{sensor.type | sensorType}}
      </h2>

      <mat-dialog-content>
        <div class="sensor-info">
          <div class="status-section">
            <span class="status-label">Estado:</span>
            <mat-slide-toggle
              [checked]="sensor.status"
              (change)="toggleStatus($event)"
              [disabled]="isProcessing">
              {{sensor.status ? 'Activo' : 'Inactivo'}}
            </mat-slide-toggle>
          </div>

          <form [formGroup]="sensorForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>ID del Sensor</mat-label>
                <input matInput [value]="sensor.id" disabled>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Frecuencia de Muestreo (s)</mat-label>
                <input matInput type="number" formControlName="samplingFrequency">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Umbral Mínimo</mat-label>
                <input matInput type="number" formControlName="thresholdMin">
                <mat-hint>{{getUnitHint(sensor.type)}}</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Umbral Máximo</mat-label>
                <input matInput type="number" formControlName="thresholdMax">
                <mat-hint>{{getUnitHint(sensor.type)}}</mat-hint>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Posición X</mat-label>
                <input matInput type="number" formControlName="xPosition">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Posición Y</mat-label>
                <input matInput type="number" formControlName="yPosition">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Posición Z</mat-label>
                <input matInput type="number" formControlName="zPosition">
              </mat-form-field>
            </div>

            <div class="last-update" *ngIf="sensor.lastUpdate">
              <mat-icon>update</mat-icon>
              Última actualización: {{sensor.lastUpdate | date:'medium'}}
            </div>
          </form>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button color="warn" 
                (click)="onDelete()"
                [disabled]="isProcessing">
          <mat-icon>delete</mat-icon>
          Eliminar Sensor
        </button>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" 
                (click)="onSave()"
                [disabled]="!sensorForm.valid || !sensorForm.dirty || isProcessing">
          <mat-icon>save</mat-icon>
          Guardar Cambios
        </button>
      </mat-dialog-actions>
    </ng-container>

    <ng-template #loading>
      <div class="loading-state">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 600px;
    }

    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1e293b;

      mat-icon {
        color: #2196f3;
      }
    }

    .sensor-info {
      padding: 1rem 0;

      .status-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;

        .status-label {
          font-weight: 500;
          color: #64748b;
        }
      }

      .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;

        mat-form-field {
          flex: 1;
        }
      }

      .last-update {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #64748b;
        font-size: 0.875rem;
        margin-top: 1rem;
        
        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    mat-dialog-actions {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
  `]
})
export class SensorDetailsModalComponent implements OnInit {
  sensorForm!: FormGroup;
  isProcessing = false;
  sensor: any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SensorDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sensorId: string },
    private sensorService: SensorService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getSensorDetails(this.data.sensorId);
  }

  getSensorDetails(sensorId: string): void {
    this.sensorService.getSensorDetails(sensorId).subscribe({
      next: (sensor) => {
        this.sensor = sensor;
        this.initForm();
      }
    });
  }

  private initForm(): void {
    this.sensorForm = this.fb.group({
      samplingFrequency: [this.sensor.samplingFrequency, [Validators.required, Validators.min(1)]],
      thresholdMin: [this.sensor.thresholdMin, [Validators.required]],
      thresholdMax: [this.sensor.thresholdMax, [Validators.required]],
      xPosition: [this.sensor.xPosition, [Validators.required]],
      yPosition: [this.sensor.yPosition, [Validators.required]],
      zPosition: [this.sensor.zPosition, [Validators.required]]
    });
  }

  getSensorIcon(type: SensorType): string {
    switch(type) {
      case SensorType.OXYGEN: return 'opacity';
      case SensorType.TEMPERATURE: return 'thermostat';
      case SensorType.PH: return 'ph';
      case SensorType.CONDUCTIVITY: return 'electric_bolt';
      case SensorType.TURBIDITY: return 'water';
      case SensorType.WATER_LEVEL: return 'height';
      case SensorType.WATER_FLOW: return 'waves';
      default: return 'sensors';
    }
  }

  getUnitHint(type: SensorType): string {
    switch(type) {
      case SensorType.OXYGEN: return 'mg/L';
      case SensorType.TEMPERATURE: return '°C';
      case SensorType.PH: return 'pH';
      case SensorType.CONDUCTIVITY: return 'µS/cm';
      case SensorType.TURBIDITY: return 'NTU';
      case SensorType.WATER_LEVEL: return 'm';
      case SensorType.WATER_FLOW: return 'L/s';
      default: return '';
    }
  }

  toggleStatus(event: any): void {
    this.isProcessing = true;
    
    const action = event.checked ? 
      this.sensorService.activateSensor(this.sensor.id) : 
      this.sensorService.desactivateSensor(this.sensor.id);
  
    action.subscribe({
      next: () => {
        this.sensor.status = event.checked;
        this._snackBar.open(
          `Sensor ${event.checked ? 'activado' : 'desactivado'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
      },
      error: () => {
        this._snackBar.open('Error al cambiar el estado del sensor', 'Cerrar', { duration: 3000 });
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  onSave(): void {
    if (this.sensorForm.valid && this.sensorForm.dirty) {
      this.isProcessing = true;
      const updatedData = {
        ...this.sensorForm.value,
        id: this.sensor.id
      };

      this.sensorService.updateSensor(this.sensor.id, updatedData).subscribe({
        next: () => {
          this._snackBar.open('Sensor actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this._snackBar.open('Error al actualizar el sensor', 'Cerrar', { duration: 3000 });
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
    }
  }

  onDelete(): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Sensor',
        message: '¿Está seguro que desea eliminar este sensor?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.isProcessing = true;
        this.sensorService.desactivateSensor(this.sensor.id).subscribe({
          next: () => {
            this._snackBar.open('Sensor eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);

          },
          error: () => {
            this._snackBar.open('Error al eliminar el sensor', 'Cerrar', { duration: 3000 });
          },
          complete: () => {
            this.isProcessing = false;
          }
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}