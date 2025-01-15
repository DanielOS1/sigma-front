import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import {BaseUser, OwnerUser, isOwnerUser } from '../../interfaces/users/usersDto';
import { UsersApiResponse } from '../../types/response.interface';
import { User } from '../../interfaces/users/usersDto';
import { UserRole } from '../../interfaces/users/roles.enum';

@Component({
  selector: 'app-system-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.scss']
})
export class SystemAdminComponent implements OnInit {
  users: (BaseUser | OwnerUser)[] = [];
  currentPage = 1;
  totalItems = 0;
  limit = 10;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage).subscribe({
      next: (response: UsersApiResponse) => {
        if (response.success) {
          this.users = response.data.users;
          this.totalItems = response.data.total;
          this.currentPage = response.data.page;
          this.limit = response.data.limit;
        } else {
          console.error('Error en la respuesta:', response.message);
          this.users = [];
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
      }
    });
  }

  get hasMorePages(): boolean {
    return this.currentPage * this.limit < this.totalItems;
  }

  nextPage() {
    if (this.hasMorePages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
  // Usar la función helper existente
  isOwnerUser = isOwnerUser;

  // Helper para obtener el nombre del rol
  getRoleName(role: number): string {
    switch (role) {
      case UserRole.OWNER:
        return 'Owner';
      case UserRole.SCIENTIST:
        return 'Scientist';
      case UserRole.AQUACULTURE_ADMIN:
        return 'Aquaculture Admin';
      case UserRole.SYSTEM_ADMIN:
        return 'System Admin';
      default:
        return 'Unknown';
    }
  }
}