import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { PasswordResetRequest } from '../../../interfaces/entities/user.interface';
import { ApiPasswordResponse } from '../../../types/response.interface';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetRequests: PasswordResetRequest[] = [];
  totalRequests: number = 0;
  displayedColumns: string[] = [
    'user_rut',
    'user_name',
    'admin_rut',
    'status',
    'createdAt',
    'updatedAt',
    'actions'
  ];
  loadingStates: { [key: string]: boolean } = {};

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadResetRequests();
  }

  loadResetRequests() {
    this.userService.getResetPasswordRequests().subscribe({
      next: (response: ApiPasswordResponse) => {
        if (response.success) {
          // Asegúrate de que ambos tipos de PasswordResetRequest son idénticos
          this.resetRequests = response.data.requests;
          this.totalRequests = response.data.total;
        }
      },
      error: (error) => {
        console.error('Error loading reset requests:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  approveRequest(requestId: string) {
    this.loadingStates[requestId] = true;
    this.userService.approvePasswordReset(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Contraseña reseteada exitosamente');
          this.loadResetRequests();
        }
      },
      error: (error) => {
        this.toastr.error('Error al resetear la contraseña');
        console.error('Error approving request:', error);
      },
      complete: () => {
        this.loadingStates[requestId] = false;
      }
    });
  }
}
