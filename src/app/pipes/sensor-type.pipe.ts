import { Pipe, PipeTransform } from '@angular/core';
import { SensorType } from '../interfaces/entities/sensor.interface';

@Pipe({
  name: 'sensorType',
  standalone: true
})
export class SensorTypePipe implements PipeTransform {
  transform(value: SensorType): string {
    switch (value) {
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
}