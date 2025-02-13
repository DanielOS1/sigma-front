import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PondAssignedScientistDetails } from '../../interfaces/entities/pool.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pool-assigned-details-modal',
  templateUrl: './pool-asigned-details-modal.component.html',
  styleUrls: ['./pool-asigned-details-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PoolAssignedDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PoolAssignedDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PondAssignedScientistDetails
  ) {
    console.log(data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}