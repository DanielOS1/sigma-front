import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../../interfaces/users/roles.enum';
import { ApiResponse } from '../../../types/response.interface';
import { User } from '../../../interfaces/users/usersDto';
import { UserService } from '../../../services/user.service';
import { BaseUser, OwnerUser } from '../../../interfaces/users/usersDto';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.scss'
})
export class CreateUsersComponent implements OnInit {
  userForm: FormGroup;
  roles = UserRole;
  
  roleOptions = [
    { value: UserRole.OWNER, label: 'Owner' },
    { value: UserRole.SCIENTIST, label: 'Científico' },
    { value: UserRole.AQUACULTURE_ADMIN, label: 'Administrador Acuícola' },
    { value: UserRole.SYSTEM_ADMIN, label: 'Administrador de Sistemas' }
  ];

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      role: ['', Validators.required],
      aquacultureRut: ['']
    });

    this.userForm.get('role')?.valueChanges.subscribe(role => {
      const aquacultureRutControl = this.userForm.get('aquacultureRut');
      
      if (role === UserRole.OWNER) {
        aquacultureRutControl?.setValidators([Validators.required]);
      } else {
        aquacultureRutControl?.clearValidators();
      }
      
      aquacultureRutControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {  
    console.log('Roles disponibles:', this.roleOptions);
  }

  getRoleIcon(role: UserRole): string {
    const icons: { [key in UserRole]: string } = {
      [UserRole.OWNER]: 'business',
      [UserRole.SCIENTIST]: 'science',
      [UserRole.AQUACULTURE_ADMIN]: 'water',
      [UserRole.SYSTEM_ADMIN]: 'admin_panel_settings'
    };
    return icons[role];
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const userData: BaseUser | OwnerUser = 
        formData.role === UserRole.OWNER 
          ? {
              ...formData,
              aquacultureRut: formData.aquacultureRut
            }
          : {
              rut: formData.rut,
              name: formData.name,
              lastName: formData.lastName,
              email: formData.email,
              role: formData.role
            };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.toastr.success('Usuario creado exitosamente');
          this.userForm.reset();
          this.router.navigate(['/system-admin']);
        },
        error: (error) => {
          this.toastr.error('Error al crear el usuario');
          console.error('Error:', error);
        }
      });
    }
  }
}
