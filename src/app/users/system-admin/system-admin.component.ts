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
import { UserRole } from '../../interfaces/users/roles.enum';
import { ApiResponse } from '../../types/response.interface';
import { user } from '../../interfaces/users/usersDto';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-system-admin',
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
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.scss']
})
export class SystemAdminComponent implements OnInit {
  userForm: FormGroup;
  roles = UserRole;
  
  roleOptions = [
    { value: UserRole.OWNER, label: 'Owner' },
    { value: UserRole.SCIENTIST, label: 'Científico' },
    { value: UserRole.AQUACULTURE_ADMIN, label: 'Administrador Acuícola' },
    { value: UserRole.SYSTEM_ADMIN, label: 'Administrador de Sistemas' }
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {  
    console.log('Roles disponibles:', this.roleOptions);
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      this.userService.createUser(this.userForm.value).subscribe((response: ApiResponse<user>) => {
        console.log('Response:', response);
      });
    }
  }
}
