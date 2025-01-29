import { Component, OnInit } from '@angular/core';
import { CenterAdminService } from '../../../services/center-admin.service';
import { AquacultureService } from '../../../services/aquaculture.service';
import { AquacultureEntity, AquacultureScientists, AssignedAquaculture } from '../../../interfaces/entities/aquaculture.interface';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../types/response.interface';
import { mapAquacultureData, mapUserData } from '../../../utils/data.utils';
import { CenterAdmin, OwnerUser, User } from '../../../interfaces/entities/user.interface';
import { PoolDetails } from '../../../interfaces/entities/pool.interface';
import { AquacultureStateService } from '../aquaculture-state.service';


@Component({
  selector: 'app-dashboard-center-admin',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './dashboard-center-admin.component.html',
  styleUrl: './dashboard-center-admin.component.scss'
})
export class DashboardCenterAdminComponent implements OnInit {
  isAssigned: boolean = false;
  loading: boolean = true;
  aquacultureBasicDetails: AquacultureEntity | null = null;
  aquacultureOwner: OwnerUser[] | null = null;
  aquacultureAdmin: CenterAdmin | null = null;

  scientists: {
    scientistRut: string;
    assignedBy: string;
    assignedAt: string;
  }[] | null = null;

  ponds: PoolDetails[] | null = null;
  
  constructor(
    private centerAdminService: CenterAdminService,
    private aquacultureService: AquacultureService,
    private aquacultureStateService: AquacultureStateService
  ) {}

  ngOnInit(): void {
    this.centerAdminService.getAssignedAquaculture().subscribe({
      next: (response: ApiResponse<AssignedAquaculture>) => {
        if (response.success) {
          this.isAssigned = response.data.assigned;
          this.aquacultureBasicDetails = mapAquacultureData(response.data.aqData);

          this.aquacultureOwner = response.data.aqData.ownerUsers.map(owner => mapUserData(owner));
          this.aquacultureAdmin = mapUserData(response.data.aqData.centerAdminCultive);

          this.aquacultureStateService.setAquacultureDetails(this.aquacultureBasicDetails);
          this.aquacultureStateService.setAquacultureOwner(this.aquacultureOwner);
          this.aquacultureStateService.setAquacultureAdmin(this.aquacultureAdmin);

        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.isAssigned = false;
      },
      complete: () => {
        this.loading = false;
        this.loadScientifics();
        this.loadPonds();
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

  loadPonds(){
    this.centerAdminService.getPoolofAquarium().subscribe({
      next: (response: ApiResponse<PoolDetails[]>) => {
        this.ponds = response.data;
        console.log(this.ponds);
      }
    });
  }

}
