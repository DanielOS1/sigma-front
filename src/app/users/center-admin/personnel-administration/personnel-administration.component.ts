import { Component, OnInit, OnDestroy } from '@angular/core';
import { AquacultureBasicDetails, AquacultureScientists, AssignedAquaculture } from '../../../interfaces/entities/aquaculture.interface';
import { ApiResponse } from '../../../types/response.interface';
import { CenterAdminService } from '../../../services/center-admin.service';
import { AquacultureService } from '../../../services/aquaculture.service';
import { CenterAdmin, OwnerUser } from '../../../interfaces/entities/user.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssignPersonnelModalComponent } from '../../../shared/assign-personnel-modal/assign-personnel-modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AquacultureStateService } from '../aquaculture-state.service';
import { Subscription } from 'rxjs';
import { mapUserData } from '../../../utils/data.utils';
import { mapAquacultureData } from '../../../utils/data.utils';

@Component({
  selector: 'app-personnel-administration',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe, CommonModule],
  templateUrl: './personnel-administration.component.html',
  styleUrl: './personnel-administration.component.scss'
})
export class PersonnelAdministrationComponent implements OnInit, OnDestroy {
  scientists: {
    scientistRut: string;
    assignedBy: string;
    assignedAt: string;
  }[] | null = null;

  isAssigned: boolean = false;
  aquacultureBasicDetails: AquacultureBasicDetails | null = null;
  aquacultureOwner: OwnerUser[] | null = null;
  aquacultureAdmin: CenterAdmin | null = null;
  loading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private centerAdminService: CenterAdminService,
    private aquacultureService: AquacultureService,
    private aquacultureStateService: AquacultureStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Suscribirse a los datos del estado
    this.subscriptions.push(
      this.aquacultureStateService.aquacultureDetails$.subscribe(details => {
        if (details) {
          this.aquacultureBasicDetails = details;
          this.loadScientifics();
        }
      }),

      this.aquacultureStateService.aquacultureOwner$.subscribe(owner => {
        if (owner) {
          this.aquacultureOwner = owner;
        }
      }),

      this.aquacultureStateService.aquacultureAdmin$.subscribe(admin => {
        if (admin) {
          this.aquacultureAdmin = admin;
        }
      })
    );

    // Si no hay datos en el estado, cargarlos
    if (!this.aquacultureBasicDetails) {
      this.loadInitialData();
    } else {
      this.loading = false;
      this.loadScientifics();
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadInitialData(): void {
    this.centerAdminService.getAssignedAquaculture().subscribe({
      next: (response: ApiResponse<AssignedAquaculture>) => {
        this.isAssigned = response.data.assigned;
        const details = mapAquacultureData(response.data.aqData);
        const owner = response.data.aqData.ownerUsers.map(owner => mapUserData(owner));
        const admin = mapUserData(response.data.aqData.centerAdminCultive);

        // Guardar en el servicio de estado
        this.aquacultureStateService.setAquacultureDetails(details);
        this.aquacultureStateService.setAquacultureOwner(owner);
        this.aquacultureStateService.setAquacultureAdmin(admin);

        this.loading = false;
      }
    });
  }

  loadScientifics(): void {
    if (this.aquacultureBasicDetails?.rut) {
      this.aquacultureService.getAqScientists(this.aquacultureBasicDetails.rut).subscribe({
        next: (response: ApiResponse<AquacultureScientists>) => {
          this.scientists = response.data.scientists;
        }
      });
    }
  }

  assignScientist(scientistRut: string): void {
    if (this.aquacultureBasicDetails?.rut) {
      this.aquacultureService.assignScientist(this.aquacultureBasicDetails.rut, scientistRut).subscribe({
        next: () => {
          this.loadScientifics();
        }
      });
    }
  }

  removeScientist(scientistRut: string): void {
    if (this.aquacultureBasicDetails?.rut) {
      this.aquacultureService.removeScientist(this.aquacultureBasicDetails.rut, scientistRut).subscribe({
        next: () => {
          this.loadScientifics();
        }
      });
    }
  }

  openAssignPersonnelModal(): void {
    const dialogRef = this.dialog.open(AssignPersonnelModalComponent, {
      data: {
        type: 'scientist',
        aquacultureRut: this.aquacultureBasicDetails?.rut
      }
    });

    dialogRef.afterClosed().subscribe((scientistRut: string) => {
      if (scientistRut) {
        this.assignScientist(scientistRut);
      }
    });
  }
}