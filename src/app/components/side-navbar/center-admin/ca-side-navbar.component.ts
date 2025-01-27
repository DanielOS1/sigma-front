import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cultivation-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav
                   [mode]="'side'"
                   [opened]="true"
                   class="sidenav"
                   [class.expanded]="isExpanded"
                   [class.collapsed]="!isExpanded">
        <div class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>{{ isExpanded ? 'chevron_left' : 'chevron_right' }}</mat-icon>
          </button>
        </div>

        <mat-nav-list>
          <!-- Dashboard -->
          <a mat-list-item routerLink="/cultivation/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span *ngIf="isExpanded">Dashboard</span>
          </a>

          <!-- Mi Perfil -->
          <a mat-list-item (click)="goToProfile()">
            <mat-icon>person</mat-icon>
            <span *ngIf="isExpanded">Mi Perfil</span>
          </a>

          <!-- Administración de Personal -->
          <a mat-list-item routerLink="/cultivation/personnel" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span *ngIf="isExpanded">Personal</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content [class.expanded]="!isExpanded">
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: transparent;
    }

    .sidenav {
      background: #fff;
      transition: width 0.3s ease;
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);

      &.expanded {
        width: 200px;
      }

      &.collapsed {
        width: 65px;
      }
    }

    .toolbar {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }

    mat-nav-list {
      padding-top: 0;

      a {
        height: 48px;
        mat-icon {
          margin-right: 16px;
        }

        &.active {
          background: #e3f2fd;
          color: #1976d2;
          
          mat-icon {
            color: #1976d2;
          }
        }
      }
    }

    mat-sidenav-content {
      transition: margin-left 0.3s ease;
      
      &.expanded {
        margin-left: 65px !important;
      }

      &:not(.expanded) {
        margin-left: 200px !important;
      }
    }
  `]
})
export class CaSideNavbarComponent {
  isExpanded = true;

  constructor(private router: Router) {}

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  goToProfile(): void {
    console.log('goToProfile');
    this.router.navigate(['/profile']);
  }

}