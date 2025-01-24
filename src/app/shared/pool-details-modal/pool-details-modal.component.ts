import { Component, Inject, OnInit } from '@angular/core';
import { PoolService } from '../../services/pool.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoolResponse } from '../../interfaces/Pool/Pool.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../types/response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pool-details-modal',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule   ], 
  templateUrl: './pool-details-modal.component.html',
  styleUrl: './pool-details-modal.component.scss'
})
export class PoolDetailsModalComponent implements OnInit {
  pool: any;
  loading: boolean = true;

  constructor(
    private poolService: PoolService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<PoolDetailsModalComponent>
  ) {}

  ngOnInit(): void {
    this.loadPoolDetails(this.data.id);
  }

  loadPoolDetails(id: string): void {
    this.poolService.getPoolbyId(id).subscribe({
      next: (response: ApiResponse<PoolResponse>) => {
        this.pool = response.data;
        console.log(response.data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  

  close(): void {
    this.dialogRef.close();
  }
}
