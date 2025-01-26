import { Component, Inject, Input, OnInit } from '@angular/core';
import { PoolService } from '../../services/pool.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoolResponse } from '../../interfaces/Pool/Pool.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../types/response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

interface Pool {
  id: string;
  depth: number;
  watertype: string;
  radius: number | null;
  length: number | null;
  height: number | null;
  ownername: string | null;
  ownerrut: string | null;
}

@Component({
  selector: 'app-pool-details-modal',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule ],   
  template: `
    <div class="modal-container" *ngIf="pool">
      <!-- Header -->
      <div class="modal-header">
        <h2>
          <mat-icon>pool</mat-icon>
          {{ pool.radius ? 'Estanque' : 'Piscina' }} #{{pool.id.slice(0,8)}}
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Información Básica -->
      <mat-card class="info-section">
        <mat-card-header>
          <mat-card-title>Información Básica</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <label>Tipo</label>
              <p>{{ pool.radius ? 'Estanque Circular' : 'Piscina Rectangular' }}</p>
            </div>
            <div class="info-item">
              <label>Profundidad</label>
              <p>{{pool.depth}} metros</p>
            </div>
            <div class="info-item">
              <label>Tipo de Agua</label>
              <p>{{pool.watertype === '1' ? 'Agua Dulce' : 'Agua Salada'}}</p>
            </div>
            <div class="info-item" *ngIf="pool.radius">
              <label>Radio</label>
              <p>{{pool.radius}} metros</p>
            </div>
            <div class="info-item" *ngIf="!pool.radius">
              <label>Largo</label>
              <p>{{pool.length}} metros</p>
            </div>
            <div class="info-item" *ngIf="!pool.radius">
              <label>Alto</label>
              <p>{{pool.height}} metros</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Personal Asignado -->
      <mat-card class="personnel-section">
        <mat-card-header>
          <mat-card-title>Personal Asignado</mat-card-title>
        </mat-card-header>
        
        <!-- Dueño -->
        <mat-card-content>
          <div class="personnel-item">
            <div class="personnel-header">
              <h3>
                <mat-icon>person</mat-icon>
                Dueño
              </h3>
              <button mat-stroked-button color="primary" *ngIf="!pool.ownerrut" (click)="assignOwner()">
                <mat-icon>person_add</mat-icon>
                Asignar Dueño
              </button>
              <button mat-stroked-button color="warn" *ngIf="pool.ownerrut" (click)="removeOwner()">
                <mat-icon>person_remove</mat-icon>
                Remover Dueño
              </button>
            </div>
            
            <div class="person-info" *ngIf="pool.ownerrut">
              <p><strong>Nombre:</strong> {{pool.ownername}}</p>
              <p><strong>RUT:</strong> {{pool.ownerrut}}</p>
            </div>
            
            <div class="empty-state" *ngIf="!pool.ownerrut">
              <p>No hay dueño asignado</p>
            </div>
          </div>

          <!-- Científicos -->
          <div class="personnel-item">
            <div class="personnel-header">
              <h3>
                <mat-icon>science</mat-icon>
                Científicos
              </h3>
              <button mat-stroked-button color="primary" (click)="assignScientist()">
                <mat-icon>person_add</mat-icon>
                Asignar Científico
              </button>
            </div>

            <div class="scientists-list" *ngIf="scientists?.length">
              <div class="person-info" *ngFor="let scientist of scientists">
                <div class="scientist-details">
                  <p><strong>RUT:</strong> {{scientist.scientistRut}}</p>
                </div>
                <button mat-icon-button color="warn" (click)="removeScientist(scientist.scientistRut)">
                  <mat-icon>person_remove</mat-icon>
                </button>
              </div>
            </div>

            <div class="empty-state" *ngIf="!scientists?.length">
              <p>No hay científicos asignados</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .modal-container {
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        
        mat-icon {
          color: #2196f3;
        }
      }
    }

    .info-section, .personnel-section {
      margin-bottom: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .info-item {
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;

      label {
        color: #64748b;
        font-size: 0.875rem;
        display: block;
        margin-bottom: 4px;
      }

      p {
        margin: 0;
        color: #333;
      }
    }

    .personnel-item {
      margin-bottom: 24px;

      .personnel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
      }
    }

    .person-info {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 4px 0;
      }
    }

    .empty-state {
      text-align: center;
      padding: 16px;
      color: #64748b;
      background: #f8fafc;
      border-radius: 8px;
    }

    .scientists-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `]
})
export class PoolDetailsModalComponent implements OnInit {
  pool: any;
  scientists: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<PoolDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private poolService: PoolService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Cargar los detalles de la piscina
    this.loadPoolDetails();
  }

  loadPoolDetails() {
    this.poolService.getPoolbyId(this.data.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.pool = response.data;
          this.loadScientists();
        }
      },
      error: (error) => {
        console.error('Error loading pool details:', error);
        this.toastr.error('Error al cargar detalles de la piscina');
      }
    });
  }

  loadScientists() {
    this.poolService.getPoolScientists(this.pool.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.scientists = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading scientists:', error);
        this.toastr.error('Error al cargar científicos');
      }
    });
  }

  assignOwner() {
    // Implementar lógica para abrir modal de asignación de dueño
  }

  removeOwner() {
    this.poolService.removeOwnerFromPool(this.pool.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.pool.ownerrut = null;
          this.pool.ownername = null;
          this.toastr.success('Dueño removido exitosamente');
        }
      },
      error: (error) => {
        console.error('Error removing owner:', error);
        this.toastr.error('Error al remover dueño');
      }
    });
  }

  assignScientist() {
    // Implementar lógica para abrir modal de asignación de científico
  }

  removeScientist(scientistRut: string) {
    this.poolService.removeScientistFromPool(this.pool.id, scientistRut).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadScientists();
          this.toastr.success('Científico removido exitosamente');
        }
      },
      error: (error) => {
        console.error('Error removing scientist:', error);
        this.toastr.error('Error al remover científico');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
