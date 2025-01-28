import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Dueño de Acuícola';
      case 2:
        return 'Científico';
      case 3:
        return 'Administrador de Acuícola';
      case 4:
        return 'Administrador de Sistema';
      case 5:
        return 'Super Administrador';
      default:
        return 'Rol Desconocido';
    }
  }
} 