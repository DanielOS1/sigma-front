import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { SensorType, SensorFormat, SensorInstance, CreateSensor, updateSensor } from '../../../interfaces/entities/sensor.interface';
import { PondType, PoolDetails, PoolDetailss } from '../../../interfaces/entities/pool.interface';
import { PoolService } from '../../../services/pool.service';
import { CenterAdminService } from '../../../services/center-admin.service';
import { ApiResponse } from '../../../types/response.interface';
import { MatMenuModule } from '@angular/material/menu';
import {  MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateSensorModalComponent } from '../../../shared/create-sensor-modal/create-sensor-modal.component';
import { SensorService } from '../../../services/sensor.service';
import { SensorTypePipe } from '../../../pipes/sensor-type.pipe'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { SensorDetailsModalComponent } from '../../../shared/sensor-details-modal/sensor-details-modal.component';


interface SensorData {
  id: string;
  type: number;
  status: boolean;
}

interface GroupedSensors {
  type: number;
  icon: string;
  sensors: SensorData[];
}

@Component({
  selector: 'app-sensor-administration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    SensorTypePipe,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './sensor-administration.component.html',
  styleUrls: ['./sensor-administration.component.scss']
})
export class SensorAdministrationComponent implements OnInit {
  pondType = PondType;
  ponds: PoolDetails[] = [];
  selectedPond: PoolDetails | null = null;
  private selectedPondSubject = new BehaviorSubject<PoolDetails | null>(null);
  selectedPond$ = this.selectedPondSubject.asObservable();
  SensorType = SensorType;

  sensors: SensorFormat[] = [
    { id: 'oxygen', type: SensorType.OXYGEN, icon: 'water_drop', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'temperature', type: SensorType.TEMPERATURE, icon: 'thermostat', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'ph', type: SensorType.PH, icon: 'science', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'conductivity', type: SensorType.CONDUCTIVITY, icon: 'bolt', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'turbidity', type: SensorType.TURBIDITY, icon: 'waves', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'waterLevel', type: SensorType.WATER_LEVEL, icon: 'speed', active: false, count: 0, instances: [] as SensorInstance[] },
    { id: 'waterFlow', type: SensorType.WATER_FLOW, icon: 'arrow_upward', active: false, count: 0, instances: [] as SensorInstance[] },
  ];

  intervals = [
    { value: '5', label: 'Cada 5 minutos' },
    { value: '10', label: 'Cada 10 minutos' },
    { value: '15', label: 'Cada 15 minutos' },
    { value: '30', label: 'Cada 30 minutos' },
    { value: '60', label: 'Cada hora' }
  ];

  availableSensorTypes: SensorType[] = [
    SensorType.OXYGEN,
    SensorType.TEMPERATURE,
    SensorType.PH,
    SensorType.CONDUCTIVITY,
    SensorType.TURBIDITY,
    SensorType.WATER_LEVEL,
    SensorType.WATER_FLOW
  ];

  groupedSensors: GroupedSensors[] = [];

  constructor(
    private centerAdminService: CenterAdminService,
    private dialog: MatDialog,
    private sensorService: SensorService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPonds();
    this.selectedPond$.subscribe(pond => {
      if (pond) {
        this.loadSensors(pond.id);
      }
    });
  }

  loadPonds() {
    this.centerAdminService.getPoolofAquarium().subscribe({
      next: (ponds: ApiResponse<PoolDetails[]>) => {
        this.ponds = ponds.data;
      },
      error: (error) => {
        this.showSnackbar('Error al cargar las piscinas');
      }
    });
  }

  onPondChange(pond: PoolDetails): void {
    this.selectedPond = pond;
    this.selectedPondSubject.next(pond);
  }

  toggleSensor(sensor: SensorFormat): void {
    sensor.active = !sensor.active;
    if (!sensor.active) {
      sensor.count = 0;
      sensor.instances = [];
    }
  }

  updateCount(sensor: any, increment: boolean): void {
    const maxCount = sensor.type === SensorType.TEMPERATURE ? 5 : 1;
    
    if (increment && sensor.count < maxCount) {
      sensor.count++;
      sensor.instances.push({
        id: Date.now(),
        type: sensor.type,
        thresholdMin: null,
        thresholdMax: null,
        samplingFrequency: 5,
        xPosition: 0,
        yPosition: 0,
        zPosition: 0,
        status: true
      });
    } else if (!increment && sensor.count > 0) {
      sensor.count--;
      sensor.instances.pop();
    }
  }

  updateInstance(sensor: SensorFormat, instance: SensorInstance, field: keyof SensorInstance, value: string): void {
    const idx = sensor.instances.findIndex(i => i.id === instance.id);
    if (idx !== -1) {
      sensor.instances[idx] = { ...instance, [field]: value };
    }
  }

  loadSensors(pondId: string): void {
    this.centerAdminService.getSensorsFromPond(pondId).subscribe({
      next: (response) => {
        // Agrupar sensores por tipo
        const grouped = response.data.reduce((acc, sensor) => {
          const existingGroup = acc.find(group => group.type === sensor.type);
          
          if (existingGroup) {
            existingGroup.sensors.push({
              id: sensor.id,
              type: sensor.type,
              status: sensor.active
            });
          } else {
            acc.push({
              type: sensor.type,
              icon: this.getSensorIcon(sensor.type),
              sensors: [{
                id: sensor.id,
                type: sensor.type,
                status: sensor.active
              }]
            });
          }
          
          return acc;
        }, [] as GroupedSensors[]);

        this.groupedSensors = grouped;
      },
      error: (error) => {
        this._snackBar.open('Error al cargar los sensores', 'Cerrar', {
          duration: 3000
        });
      }
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

  getSensorTypeName(type: SensorType): string {
    switch(type) {
      case SensorType.OXYGEN: return 'Oxígeno';
      case SensorType.TEMPERATURE: return 'Temperatura';
      case SensorType.PH: return 'pH';
      case SensorType.CONDUCTIVITY: return 'Conductividad';
      case SensorType.TURBIDITY: return 'Turbidez';
      case SensorType.WATER_LEVEL: return 'Nivel de Agua';
      case SensorType.WATER_FLOW: return 'Flujo de Agua';
      default: return 'Desconocido';
    }
  }

  
  viewSensorDetails(sensor: any): void {
    const dialogRef = this.dialog.open(SensorDetailsModalComponent, {
      width: '500px',
      data: { sensorId: sensor.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSensors(this.selectedPond!.id);
      }
    });
  }

openCreateSensorModal(type: SensorType): void {
  if (!this.selectedPond) {
    this._snackBar.open('Seleccione una piscina primero', 'Cerrar', {
      duration: 3000
    });
    return;
  }

  const dialogRef = this.dialog.open(CreateSensorModalComponent, {
    width: '500px',
    data: {
      type: type,
      pondId: this.selectedPond.id
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const sensorData: CreateSensor = {
        ...result,
        type: type,
        pondId: this.selectedPond!.id
      };
      this.createSensor(sensorData);
    }
  });
}

  createSensor(sensorData: CreateSensor): void {
    this.sensorService.createSensor(sensorData).subscribe({
      next: (response: ApiResponse<CreateSensor>) => {
        console.log('Sensor creado:', response);
        this._snackBar.open('Sensor creado exitosamente', 'Cerrar', {
          duration: 3000
        });
        this.loadSensors(this.selectedPond!.id);
      },
      error: (error) => {
        this._snackBar.open('Error al crear el sensor', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  updateSensorConfig(sensor: SensorFormat, instance: SensorInstance) {
    instance.isUpdating = true;
    
    const updateData: updateSensor = {
      samplingFrequency: instance.samplingFrequency,
      xPosition: instance.xPosition,
      yPosition: instance.yPosition,
      zPosition: instance.zPosition
    };

    this.sensorService.updateSensor(instance.id, updateData).subscribe({
      next: (response) => {
        this.showSnackbar('Sensor actualizado correctamente');
        instance.isUpdating = false;
      },
      error: (error) => {
        this.showSnackbar('Error al actualizar el sensor');
        instance.isUpdating = false;
      }
    });
  }

  toggleSensorStatus(sensor: SensorFormat, instance: SensorInstance) {
    instance.isUpdating = true;
    
    const action = instance.status ? 
      this.sensorService.desactivateSensor(instance.id) : 
      this.sensorService.activateSensor(instance.id);


    action.subscribe({
      next: (response) => {
        instance.status = !instance.status;
        this.showSnackbar(`Sensor ${instance.status ? 'activado' : 'desactivado'} correctamente`);
        instance.isUpdating = false;
      },
      error: (error) => {
        this.showSnackbar('Error al cambiar el estado del sensor');
        instance.isUpdating = false;
      }
    });
  }

  private showSnackbar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}


