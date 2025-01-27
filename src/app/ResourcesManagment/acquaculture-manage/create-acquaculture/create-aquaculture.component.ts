import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AquacultureService } from '../../../services/aquaculture.service';
import { CreateAquacultureDto } from '../../../interfaces/aquaculture/aquaculture.interface';

@Component({
  selector: 'app-create-cquaculture',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-aquaculture.component.html',
  styleUrls: ['./create-aquaculture.component.scss']
})
export class CreateAquacultureComponent {
  aquacultureForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private aquacultureService: AquacultureService
  ) {
    this.aquacultureForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]]
    });
  }

  onSubmit() {
    if (this.aquacultureForm.valid) {
      const aquacultureData: CreateAquacultureDto = this.aquacultureForm.value;
      this.aquacultureService.createAquaculture(aquacultureData).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Aquaculture created successfully');
            this.aquacultureForm.reset();
          }
        },
        error: (error) => {
          console.error('Error creating aquaculture:', error);
        }
      });
    }
  }
}
