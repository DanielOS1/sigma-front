import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse } from '../types/response.interface';
import { RolePipe } from '../pipes/role.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuditLog } from '../interfaces/users/audits.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, RolePipe, MatIconModule, MatDividerModule, MatPaginatorModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = {
    rut: '',
    name: '',
    lastName: '',
    email: '',
    role: 0,
    isActive: false,
    isDeleted: false,
  };

  audits: AuditLog[] = [];
  totalAudits: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(private userService: UserService) {}
  
  userType: string = '';

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<User>) => {
      this.user = user.data;
    });

    this.loadAudits();
  }

  loadAudits(page: number = 0) {
    this.userService.getAudits(page + 1, this.pageSize).subscribe({
      next: (response: AuditLog[]) => {
        console.log('Audits received:', response);
        this.audits = response;
        this.totalAudits = response.length;
      },
      error: (error) => {
        console.error('Error loading audits:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAudits(this.currentPage);
  }

  
}
