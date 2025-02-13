import { Component } from '@angular/core';
import { ScientistService } from '../../../services/scientist.service';
import { AquacultureAssignmentsScientist, AquacultureAssignmentsScientistDetails } from '../../../interfaces/entities/aquaculture.interface';
import { ApiResponse } from '../../../types/response.interface';
import { CommonModule } from '@angular/common';
import { PoolAssignedDetailsModalComponent } from '../../../shared/pool-asigned-details-modal/pool-asigned-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-scientist-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scientist-dashboard.component.html',
  styleUrl: './scientist-dashboard.component.scss'
})
export class ScientistDashboardComponent {

  aquacultureAssignments: AquacultureAssignmentsScientist[] = [];
  selectedAquaculture: AquacultureAssignmentsScientistDetails | null = null; 
  constructor(private scientistService: ScientistService, private dialog: MatDialog) { 
    this.loadAquacultureAssignments();
  }

  loadAquacultureAssignments() {
    this.scientistService.getAquacultureAssignments().subscribe((response) => {
      this.aquacultureAssignments = response.data;
      this.loadAquacultureDetails(this.aquacultureAssignments[0].id);

    });
  }

  loadAquacultureDetails(aquacultureId: string) {
    this.scientistService.getAquacultureDetails("56acb6ec-a889-4217-8631-faa6837271dd").subscribe((response: ApiResponse<AquacultureAssignmentsScientistDetails>) => {
       this.selectedAquaculture = response.data;
    });
  }

  openPondDetails(pondId: string): void {
    this.scientistService.getPondDetails(pondId).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialog.open(PoolAssignedDetailsModalComponent, {
            width: '500px',
            data: response.data
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener detalles del estanque:', error);
      }
    });
  }
}
