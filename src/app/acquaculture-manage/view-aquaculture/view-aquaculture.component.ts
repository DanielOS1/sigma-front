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
import { AquacultureDetail, AquacultureDetailResponse } from '../../interfaces/aquaculture/aquaculture.interface';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PoolService } from '../../services/pool.service';
import { MatDialog } from '@angular/material/dialog';
import { PoolDetailsModalComponent } from '../../shared/pool-details-modal/pool-details-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Scientist } from '../../interfaces/users/usersDto';
import { AddScientistModalComponent } from '../../shared/add-scientist-modal/add-scientist-modal.component';

interface ScientistResponse {
  scientistRut: string;
  assignedBy: string;
  assignedAt: string;
}

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
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-aquaculture.component.html',
  styleUrls: ['./view-aquaculture.component.scss']
})
export class ViewAquacultureComponent implements OnInit {
  aquacultures: any[] = [];
  selectedRut: string = '';
  aquacultureDetail: AquacultureDetail | null = null;
  adminRut: string = '';
  loading: boolean = false;
  scientists: ScientistResponse[] = [];

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
    this.loading = true;
    this.aquacultureService.getAllAquacultures().subscribe({
      next: (response) => {
        if (response.success) {
          this.aquacultures = response.data.aquacultures;
        } else {
          this.toastr.error('Error al cargar las acuícolas');
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar las acuícolas');
        console.error('Error loading aquacultures:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  selectAquaculture(rut: string) {
    this.selectedRut = rut;
    this.loading = true;
    
    // Cargamos los detalles básicos
    this.aquacultureService.getAquacultureByRut(rut).subscribe({
      next: (response) => {
        if (response.success) {
          this.aquacultureDetail = response.data;
          // Cargamos las piscinas y científicos
          this.loadPools(rut);
          this.loadScientists(rut);
        } else {
          this.toastr.error('Error al cargar los detalles de la acuícola');
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar los detalles de la acuícola');
        console.error('Error loading aquaculture details:', error);
        this.loading = false;
      }
    });
  }

  loadPools(aquacultureRut: string) {
    this.poolService.getPoolofAquarium(aquacultureRut).subscribe({
      next: (response) => {
        if (response.success && this.aquacultureDetail) {
          this.aquacultureDetail.pools = response.data;
          console.log('Piscinas cargadas:', this.aquacultureDetail.pools);
        } else {
          this.toastr.error('Error al cargar las piscinas');
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar las piscinas');
        console.error('Error loading pools:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadScientists(aquacultureRut: string) {
    // Reiniciamos el array antes de la nueva carga
    this.scientists = [];
    
    this.aquacultureService.getAqScientists(aquacultureRut).subscribe({
      next: (response) => {
        if (response.success) {
          this.scientists = response.data.scientists;
        } else {

        }
      },
      error: (error) => {
    
        console.error('Error loading scientists:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  assignAdmin(): void {
    if (!this.adminRut || !this.selectedRut) {
      this.toastr.error('Por favor, ingrese un RUT de administrador válido');
      return;
    }

    this.loading = true;
    this.aquacultureService.assignAqAdmin(this.adminRut, this.selectedRut).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('Administrador asignado exitosamente');
          this.selectAquaculture(this.selectedRut); // Recargamos los detalles
        } else {
          this.toastr.error('Error al asignar administrador');
        }
      },
      error: (error: any) => {
        this.toastr.error('Error al asignar administrador');
        console.error('Error assigning admin:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToCreatePool(): void {
    if (!this.selectedRut) {
      this.toastr.error('Por favor, seleccione una acuícola primero');
      return;
    }
    this.router.navigate(['/system-admin/pool-managment/create-pool'], {
      queryParams: { rut: this.selectedRut }
    });
  }

  openPoolDetails(id: string): void {
    this.dialog.open(PoolDetailsModalComponent, {
      data: { id },
      width: '500px',
      height: 'auto',
      maxHeight: '90vh'
    });
  }

  removeAdmin(): void {
    this.aquacultureService.removeAquacultureAdmin(this.selectedRut).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('Administrador eliminado exitosamente');
        }
      }
    });
  }

  openAddScientistModal(): void {
    const dialogRef = this.dialog.open(AddScientistModalComponent, {
      data: { aquacultureRut: this.selectedRut }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aquacultureService.assignScientist(this.selectedRut, result).subscribe({
          next: (response: any) => {
            this.toastr.success('Científico asignado exitosamente');
          }
        });
      } else {
        this.toastr.error('No se encontró el científico');
      }
    });
  }
}