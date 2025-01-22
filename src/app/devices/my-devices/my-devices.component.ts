import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DeviceService, Device } from '../../services/device.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.scss']
})
export class MyDevicesComponent implements OnInit {
  devices: Device[] = [];
  isLoading = true;

  constructor(
    private deviceService: DeviceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.deviceService.getMyDevices().subscribe({
      next: (response) => {
        if (response.success) {
          this.devices = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los dispositivos');
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  deleteDevice(deviceId: string): void {
    this.deviceService.deleteDevice(deviceId).subscribe({
      next: (response) => {
        if (response.success) {
          this.devices = this.devices.filter(device => device.id !== deviceId);
          this.toastr.success('Dispositivo eliminado con éxito');
        } else {
          this.toastr.error('Error al eliminar el dispositivo');
        }
      },
      error: (error) => {
        this.toastr.error('Error al eliminar el dispositivo');
        console.error('Error:', error);
      }
    });
  }

  deleteAllDevices(): void {
    this.deviceService.deleteAllDevices().subscribe({
      next: (response) => {
        if (response.success) {
          this.devices = [];
          this.toastr.success('Todos los dispositivos han sido eliminados');
        } else {
          this.toastr.error('Error al eliminar todos los dispositivos');
        }
      },
      error: (error) => {
        this.toastr.error('Error al eliminar todos los dispositivos');
        console.error('Error:', error);
      }
    });
  }
} 