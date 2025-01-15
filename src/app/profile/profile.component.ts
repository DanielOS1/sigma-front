import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/users/usersDto';
import { ApiResponse } from '../types/response.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <!-- Contenido común para todos los perfiles -->
      <div class="common-info">
        <h2>Información básica</h2>
        <p>{{user.name}} {{user.lastName}}</p>
        <p>{{user.email}}</p>
        <p>{{user.rut}}</p>
        <p>{{user.role}}</p>

      </div>

      <!-- Contenido específico según el tipo de usuario -->
      <h2>Información básica</h2>
      <ng-container [ngSwitch]="userType">
        <!-- <app-admin-profile *ngSwitchCase="'admin'" [userData]="userData"></app-admin-profile> -->
        <!-- <app-user-profile *ngSwitchCase="'user'" [userData]="userData"></app-user-profile> -->
      </ng-container>
    </div>
  `
})
export class ProfileComponent{

  user: User = {
    rut: '',
    name: '',
    lastName: '',
    email: '',
    role: 0,
  };

  constructor(private userService: UserService){}
  
  userType: string = '';

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: ApiResponse<User>) => {
      this.user = user.data;
    });
  }

}
