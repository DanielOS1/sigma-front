import { Pipe, PipeTransform } from '@angular/core';
import { PondType } from '../interfaces/Pool/Pool.interface';

@Pipe({
  name: 'poolType',
  standalone: true
})
export class PoolTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value === PondType.POND) {
      return 'Pond';
    }
    return 'Pool';
  }

}
