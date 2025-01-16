import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PasswordRequest {
  id: string;
  user_rut: string;
  admin_rut: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface ApiPasswordResponse {
  message: string;
  data: {
    requests: PasswordRequest[];
    total: number;
  };
  success: boolean;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetRequests: PasswordRequest[] = [];
  totalRequests = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadResetRequests();
  }

  loadResetRequests() {
    this.userService.getResetPasswordRequests().subscribe({
      next: (response) => {
        if (response.success) {
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
    this.userService.approvePasswordReset(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadResetRequests();
        }
      },
      error: (error) => {
        console.error('Error approving request:', error);
      }
    });
  }
}
