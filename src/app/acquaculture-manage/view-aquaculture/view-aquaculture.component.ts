import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AquacultureService } from '../../services/aquaculture.service';
import { AquacultureDetail, AquacultureDetailResponse, Pool } from '../../interfaces/aquaculture/aquaculture.interface';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PoolService } from '../../services/pool.service';
import { ApiResponse } from '../../types/response.interface';
import { PoolDetailsModalComponent } from '../../shared/pool-details-modal/pool-details-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-view-aquaculture',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './view-aquaculture.component.html',
  styleUrls: ['./view-aquaculture.component.scss']
})
export class ViewAquacultureComponent implements OnInit {
  aquacultures: any[] = [];
  selectedRut: string = '';
  aquacultureDetail: AquacultureDetail | null = null;
  adminRut: string = '';
  pools: Pool[] = [];

  constructor(
    private aquacultureService: AquacultureService,
    private toastr: ToastrService,
    private router: Router,
    private poolService: PoolService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadAquacultures();
  }

  loadAquacultures() {
    this.aquacultureService.getAllAquacultures().subscribe({
      next: (response) => {
        if (response.success) {
          this.aquacultures = response.data.aquacultures;
        }
      },
      error: (error) => {
        console.error('Error loading aquacultures:', error);
      }
    });
  }

  loadAquacultureDetail() {
    if (this.selectedRut) {
      this.aquacultureService.getAquacultureByRut(this.selectedRut).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Respuesta:', response);
            this.aquacultureDetail = response.data.data;
            this.pools = response.data.data.pools;
            this.getPoolofAquarium(this.selectedRut);
          } else {
            console.error('Error en la respuesta:', response);
          }
        },
        error: (error) => {
          console.error('Error completo:', error);
        }
      });
    } else {
      console.error('RUT no proporcionado');
    }
  }

  selectAquaculture(rut: string) {
    this.selectedRut = rut;
    this.loadAquacultureDetail();
  }

  assignAdmin(): void {
    if (this.adminRut && this.selectedRut) {
      this.aquacultureService.assignAqAdmin(this.adminRut, this.selectedRut).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Administrador asignado exitosamente');
            this.loadAquacultureDetail();
          }
        },
        error: (error) => {
          this.toastr.error('Error al asignar administrador');
          console.error('Error asignando admin:', error);
        }
      });
    }
  }

  goToCreatePool(): void {
    console.log('Rut de la acuícola:', this.selectedRut);
    this.router.navigate(['/system-admin/pool-managment/create-pool'], { queryParams: { rut: this.selectedRut } });
  }

  getPoolofAquarium(aquariumRut: string): void {
    this.poolService.getPoolofAquarium(aquariumRut).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log(response);
        this.aquacultureDetail!.pools = response.data.data;
      }
    });
  }

  openPoolDetails(id: number): void {
    console.log("funciona");
    this.dialog.open(PoolDetailsModalComponent, {
      data: { id: id },
      width: '500px',
      height: '500px'
    });
  }

  openScientificAssignModal(id: number): void {
  }


}