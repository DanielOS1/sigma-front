import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PoolService } from '../../../services/pool.service';
import { AquacultureStateService } from '../aquaculture-state.service';
import { CreatePoolModalComponent } from '../../../shared/create-pool-modal/create-pool-modal.component';
import { CenterAdminService } from '../../../services/center-admin.service';
import { ApiResponse } from '../../../types/response.interface';
import { AquacultureEntity, AquacultureScientists } from '../../../interfaces/entities/aquaculture.interface';
import { AquacultureService } from '../../../services/aquaculture.service';
import { PoolDetails, PoolAdvancedDetails } from '../../../interfaces/entities/pool.interface';
import { AssignPersonnelModalComponent } from '../../../shared/assign-personnel-modal/assign-personnel-modal.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pond-administration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pond-administration.component.html',
  styleUrls: ['./pond-administration.component.scss']
})
export class PondAdministrationComponent implements OnInit, OnDestroy {
  aquacultureDetails: AquacultureEntity | null = null;
  ponds: PoolDetails[] = [];
  selectedPond: PoolAdvancedDetails | null = null;
  selectedPondId: string = '';
  loading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private aquacultureStateService: AquacultureStateService,
    private centerAdminService: CenterAdminService,
    private poolService: PoolService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadPonds();
    this.subscriptions.push(
      this.aquacultureStateService.aquacultureDetails$.subscribe(details => {
        if (details) {
          this.aquacultureDetails = details;
          
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPonds() {
    this.loading = true;
    this.centerAdminService.getPoolofAquarium().subscribe({
      next: (response) => {
        if (response.success) {
          this.ponds = response.data;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar piscinas:', error);
        this.toastr.error('Error al cargar las piscinas');
        this.loading = false;
      }
    });
  }

  selectPond(id: string) {
    this.selectedPondId = id;
    this.loading = true;
    
    this.centerAdminService.getPoolbyId(id).subscribe({
      next: (response: ApiResponse<PoolAdvancedDetails>) => {
        console.log('Respuesta completa:', response);
        if (response.success) {
          console.log('Datos a asignar:', response.data);


          this.selectedPond = response.data;
          console.log('Selected Pond después de asignar:', this.selectedPond);
          this.loading = false;

        }
      },
      error: (error) => {
        console.error('Error al cargar detalles de la piscina:', error);
        this.toastr.error('Error al cargar detalles de la piscina');
        this.loading = false;
      }
    });
  }

  openCreatePondModal() {
    if (!this.aquacultureDetails?.rut) return;

    const dialogRef = this.dialog.open(CreatePoolModalComponent, {
      data: { aquacultureRut: this.aquacultureDetails.rut },
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPonds();
        this.toastr.success('Piscina creada exitosamente');
      }
    });
  }

  assignOwner() {
    if (!this.selectedPond) return;

    const dialogRef = this.dialog.open(AssignPersonnelModalComponent, {
      data: { 
        type: 'owner',
        aquacultureRut: this.aquacultureDetails?.rut
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(ownerRut => {
      if (ownerRut) {
        this.poolService.assignOwnerToPool(this.selectedPond!.id, ownerRut).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadPonds();
              this.toastr.success('Dueño asignado exitosamente');
            }
          },
          error: (error) => {
            console.error('Error al asignar dueño:', error);
            this.toastr.error('Error al asignar dueño');
          }
        });
      }
    });
  }

  removeOwner() {
    if (!this.selectedPond) return;

    this.poolService.removeOwnerFromPool(this.selectedPond.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadPonds();
          this.toastr.success('Dueño removido exitosamente');
        }
      },
      error: (error) => {
        console.error('Error al remover dueño:', error);
        this.toastr.error('Error al remover dueño');
      }
    });
  }

  assignScientist() {
    if (!this.selectedPond) return;

    const dialogRef = this.dialog.open(AssignPersonnelModalComponent, {
      data: { 
        type: 'scientist',
        aquacultureRut: this.aquacultureDetails?.rut
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(scientistRut => {
      if (scientistRut) {
        this.poolService.assignScientistToPool(this.selectedPond!.id, scientistRut).subscribe({
          next: (response) => {
            if (response.success) {
              this.selectPond(this.selectedPond!.id);

              this.toastr.success('Científico asignado exitosamente');
            }
          },
          error: (error) => {
            console.error('Error al asignar científico:', error);
            this.toastr.error('Error al asignar científico');
          }
        });
      }
    });
  }

  removeScientist() {
    if (!this.selectedPond || !this.selectedPond.scientist) return;

    this.poolService.removeScientistFromPool(
      this.selectedPond.id, 
      this.selectedPond.scientist.rut!


    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectPond(this.selectedPond!.id);
          this.toastr.success('Científico removido exitosamente');
        }
      },
      error: (error) => {
        console.error('Error al remover científico:', error);
        this.toastr.error('Error al remover científico');
      }
    });
  }

  editPond() {
    // Implementar lógica de edición
  }

  deletePond() {}

  // Método helper para obtener el pondType
  getPondType(id: string): string | undefined {
    return this.ponds.find(pond => pond.ponds_id === id)?.ponds_pondType;
  }

  // Método helper para verificar si es circular
  isCircularPond(id: string): boolean {
    return this.getPondType(id) === '1';
  }
}
