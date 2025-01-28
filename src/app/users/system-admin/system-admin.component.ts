import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import {BaseUser, OwnerUser, isOwnerUser } from '../../interfaces/users/usersDto';
import { UsersApiResponse } from '../../types/response.interface';
import { UserRole } from '../../interfaces/users/roles.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-system-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.scss']
})
export class SystemAdminComponent implements OnInit {
  users: (BaseUser | OwnerUser)[] = [];
  currentPage = 1;
  totalItems = 0;
  limit = 10;
  displayedColumns: string[] = ['name', 'lastName', 'rut', 'email', 'role', 'status', 'actions'];
  searchTerm: string = '';
  loadingStates: { [key: string]: boolean } = {};

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

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
        return 'Dueño de Acuícola';
      case UserRole.SCIENTIST:
        return 'Científico';
      case UserRole.AQUACULTURE_ADMIN:
        return 'Administrador de centro de cultivo';
      case UserRole.SYSTEM_ADMIN:
        return 'Administrador de Sistema';
      case UserRole.SUPER_ADMIN:
        return 'Super Administrador';
      default:
        return 'Rol Desconocido';
    }
  }

  toggleDisableUser(rut: string, isActive: boolean) {
    this.loadingStates[rut] = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${isActive ? 'Desactivar' : 'Activar'} Usuario`,
        message: `¿Está seguro que desea ${isActive ? 'desactivar' : 'activar'} este usuario?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeUserDisabledStatus(rut).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(`Usuario ${isActive ? 'desactivado' : 'activado'} exitosamente`);
              this.loadUsers();
            }
          },
          error: (error) => {
            this.toastr.error('Error al cambiar el estado del usuario');
            console.error('Error changing user status:', error);
          },
          complete: () => {
            this.loadingStates[rut] = false;
          }
        });
      } else {
        this.loadingStates[rut] = false;
      }
    });
  }

  toggleDeleteUser(rut: string, isDeleted: boolean) {
    this.loadingStates[rut] = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `${isDeleted ? 'Restaurar' : 'Eliminar'} Usuario`,
        message: `¿Está seguro que desea ${isDeleted ? 'restaurar' : 'eliminar'} este usuario?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.changeUserDeletedStatus(rut).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success(`Usuario ${isDeleted ? 'restaurado' : 'eliminado'} exitosamente`);
              this.loadUsers();
            }
          },
          error: (error) => {
            this.toastr.error('Error al cambiar el estado del usuario');
            console.error('Error changing user deleted status:', error);
          },
          complete: () => {
            this.loadingStates[rut] = false;
          }
        });
      } else {
        this.loadingStates[rut] = false;
      }
    });
  }
}