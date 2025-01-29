import { Component, OnInit } from '@angular/core';
import { CenterAdminService } from '../../../services/center-admin.service';
import { AquacultureService } from '../../../services/aquaculture.service';
import { AssignedAquaculture } from '../../../interfaces/entities/aquaculture.interface';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../types/response.interface';


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
  aquacultureDetail: AssignedAquaculture | null = null;
  


  constructor(
    private centerAdminService: CenterAdminService,
    private aquacultureService: AquacultureService
  ) {}

  ngOnInit(): void {
    this.centerAdminService.getAssignedAquaculture().subscribe({
      next: (response: ApiResponse<AssignedAquaculture>) => {
        if (response.success) {
          this.isAssigned = response.data.assigned;
          this.aquacultureDetail = response.data;
          console.log(this.aquacultureDetail);
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.isAssigned = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
