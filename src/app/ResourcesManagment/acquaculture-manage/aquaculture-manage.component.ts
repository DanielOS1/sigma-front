import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AquacultureService } from '../../services/aquaculture.service';
import { Aquaculture } from '../../interfaces/aquaculture/aquaculture.interface';

interface AquacultureResponse {
  aquacultures: Aquaculture[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  }
}

@Component({
  selector: 'app-aquaculture-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './aquaculture-manage.component.html',
  styleUrls: ['./aquaculture-manage.component.scss']
})
export class AquacultureManageComponent implements OnInit {
  aquacultures: Aquaculture[] = [];
  currentPage = 1;
  totalItems = 0;
  lastPage = 1;

  constructor(
    private aquacultureService: AquacultureService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAquacultures();
  }

  loadAquacultures() {
    this.aquacultureService.getAllAquacultures(this.currentPage).subscribe({
      next: (response) => {
        if (response.success) {
          this.aquacultures = response.data.aquacultures;
          this.totalItems = response.data.meta.total;
          this.lastPage = response.data.meta.lastPage;
          this.currentPage = response.data.meta.page;
        }
      },
      error: (error) => {
        console.error('Error loading aquacultures:', error);
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      this.currentPage++;
      this.loadAquacultures();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAquacultures();
    }
  }

  selectAquaculture(rut: string) {

  }
}
