import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AquacultureService } from '../../services/aquaculture.service';
import { AquacultureDetail, AquacultureDetailResponse } from '../../interfaces/aquaculture/aquaculture.interface';

@Component({
  selector: 'app-view-aquaculture',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './view-aquaculture.component.html',
  styleUrls: ['./view-aquaculture.component.scss']
})
export class ViewAquacultureComponent implements OnInit {
  aquacultures: any[] = [];
  selectedRut: string = '';
  aquacultureDetail: AquacultureDetail | null = null;

  constructor(private aquacultureService: AquacultureService) {}

  ngOnInit() {
    this.loadAquacultures();
  }

  loadAquacultures() {
    this.aquacultureService.getAllAquacultures().subscribe({
      next: (response) => {
        if (response.success) {
          this.aquacultures = response.data.aquacultures;
        }
      },
      error: (error) => {
        console.error('Error loading aquacultures:', error);
      }
    });
  }

  loadAquacultureDetail() {
    if (this.selectedRut) {
      console.log('Enviando RUT:', this.selectedRut);

      this.aquacultureService.getAquacultureByRut(this.selectedRut).subscribe({
        next: (response: AquacultureDetailResponse) => {
          if (response.success) {
            console.log('Respuesta:', response);
            this.aquacultureDetail = response.data;
          } else {
            console.error('Error en la respuesta:', response);
          }
        },
        error: (error) => {
          console.error('Error completo:', error);
        }
      });
    } else {
      console.error('RUT no proporcionado');
    }
  }
}