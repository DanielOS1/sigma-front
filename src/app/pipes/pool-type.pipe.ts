import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'poolType',
  standalone: true
})
export class PoolTypePipe implements PipeTransform {
  transform(value: string | number): string {
    // "1" es estanque (tiene radio)
    // "2" es piscina (tiene largo y alto)
    return value === 1 || value === "1" ? 'Estanque' : 'Piscina';
  }
}
