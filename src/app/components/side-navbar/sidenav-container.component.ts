import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSystemSideNavComponent } from './system-admin/side-navbar.component';
import { CaSideNavbarComponent } from './center-admin/ca-side-navbar.component';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../interfaces/users/roles.enum';

@Component({
  selector: 'app-sidenav-container',
  standalone: true,
  imports: [
    CommonModule,
    AdminSystemSideNavComponent,
    CaSideNavbarComponent
  ],
  template: `
    <app-side-nav *ngIf="userRole === roles.SYSTEM_ADMIN">
      <ng-content></ng-content>
    </app-side-nav>

    <app-cultivation-sidenav *ngIf="userRole === roles.AQUACULTURE_ADMIN">
      <ng-content></ng-content>
    </app-cultivation-sidenav>
  `
})
export class SidenavContainerComponent implements OnInit {
  userRole?: number;
  roles = UserRole;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.userRole = response.data.role;
        }
      },
      error: (error) => {
        console.error('Error loading user role:', error);
      }
    });
  }
} 