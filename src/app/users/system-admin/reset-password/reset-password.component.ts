import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { PasswordResetRequest } from '../../../types/response.interface';

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
  resetRequests: PasswordResetRequest[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadResetRequests();
  }

  loadResetRequests() {
    this.userService.getResetPasswordRequests().subscribe({
      next: (response) => {
        if (response.success) {
          this.resetRequests = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading reset requests:', error);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  approveRequest(requestId: string) {
    this.userService.approvePasswordReset(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          // Recargar la lista para reflejar los cambios
          this.loadResetRequests();
        }
      },
      error: (error) => {
        console.error('Error resetting password:', error);
      }
    });
  }
}
