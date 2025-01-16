import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse } from '../types/response.interface';
import { RolePipe } from '../pipes/role.pipe';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, RolePipe],
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

  constructor(private userService: UserService) {}
  
  userType: string = '';

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<User>) => {
      this.user = user.data;
    });
  }
}
