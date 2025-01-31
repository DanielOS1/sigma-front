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
import { SensorType, SensorFormat, SensorInstance } from '../../../interfaces/entities/sensor.interface';



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
    FormsModule
  ],
  templateUrl: './sensor-administration.component.html',
  styleUrls: ['./sensor-administration.component.scss']
})
export class SensorAdministrationComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}

  toggleSensor(sensor: SensorFormat): void {
    sensor.active = !sensor.active;
    if (!sensor.active) {
      sensor.count = 0;
      sensor.instances = [];
    }
  }

  updateCount(sensor: any, increment: boolean): void {
    if (increment && sensor.count < 5) {
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
}
