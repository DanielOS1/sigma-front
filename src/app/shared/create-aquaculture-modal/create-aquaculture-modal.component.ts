import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AquacultureService } from '../../services/aquaculture.service';
import { CreateAquacultureDto } from '../../interfaces/aquaculture/aquaculture.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-aquaculture-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-aquaculture-modal.component.html',
  styleUrls: ['./create-aquaculture-modal.component.scss']
})
export class CreateAquacultureModalComponent {
  aquacultureForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private aquacultureService: AquacultureService,
    private dialogRef: MatDialogRef<CreateAquacultureModalComponent>,
    private toastr: ToastrService
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
      this.loading = true;
      const aquacultureData: CreateAquacultureDto = this.aquacultureForm.value;
      
      this.aquacultureService.createAquaculture(aquacultureData).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Acuícola creada exitosamente');
            this.dialogRef.close(true);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.error('Error al crear la acuícola');
          console.error('Error creating aquaculture:', error);
        }
      });
    } else {
      this.toastr.error('Por favor, complete todos los campos correctamente');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 