import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PoolService } from '../../../services/pool.service';
import { AquacultureStateService } from '../aquaculture-state.service';
import { CreatePoolModalComponent } from '../../../shared/create-pool-modal/create-pool-modal.component';
import { CenterAdminService } from '../../../services/center-admin.service';
import { ApiResponse } from '../../../types/response.interface';
import { AquacultureScientists } from '../../../interfaces/entities/aquaculture.interface';
import { AquacultureService } from '../../../services/aquaculture.service';

@Component({
  selector: 'app-pond-administration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './pond-administration.component.html',
  styleUrls: ['./pond-administration.component.scss']
})
export class PondAdministrationComponent implements OnInit {
  aquacultureBasicDetails: any = null;
  ponds: any[] = [];
  selectedPond: any = null;
  selectedPondId: string = '';
  scientists: any[] = [];

  constructor(
    private centerAdminService: CenterAdminService,
    private aquacultureStateService: AquacultureStateService,
    private dialog: MatDialog,
    private aquacultureService: AquacultureService
  ) {}

  ngOnInit() {

    this.loadPonds();
    
    this.aquacultureStateService.aquacultureDetails$.subscribe(details => {
      if (details) {
        this.aquacultureBasicDetails = details;
      }
    });
  }

  loadPonds() {
    this.centerAdminService.getPoolofAquarium().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Piscinas cargadas:', response.data);
          this.ponds = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar las piscinas:', error);
      }
    });
  }

    loadScientifics(){
    this.aquacultureService.getAqScientists(this.aquacultureBasicDetails?.rut!).subscribe({
      next: (response: ApiResponse<AquacultureScientists>) => {
        this.scientists = response.data.scientists;
        console.log(this.scientists);
      }
    });
  }


  selectPond(id: string) {
    this.selectedPondId = id;
    this.selectedPond = this.ponds.find(pond => pond.id === id);
  }

  openCreatePondModal() {
    const dialogRef = this.dialog.open(CreatePoolModalComponent, {
      data: { aquacultureRut: this.aquacultureBasicDetails.rut },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPonds();
      }
    });
  }

  editPond() {
    // Implementar lógica de edición
  }

  deletePond() {
    // Implementar lógica de eliminación
  }
}
