import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { PoolService } from '../../services/pool.service';
import { WaterType, PondType } from '../../interfaces/entities/pool.interface'; 

@Component({
  selector: 'app-create-pool-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './create-pool-modal.component.html',
  styleUrls: ['./create-pool-modal.component.scss']
})
export class CreatePoolModalComponent {
  pondForm: FormGroup;
  WaterType = WaterType;
  PondType = PondType;
  showAdditionalFields: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private poolService: PoolService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreatePoolModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { aquacultureRut: string }
  ) {
    this.pondForm = this.fb.group({
      waterType: [null, Validators.required],
      depth: [null, [Validators.required, Validators.min(1), Validators.max(15)]],
      pondType: [null, Validators.required],
      radius: [null],
      length: [null],
      height: [null],
    });
  }

  onPondTypeChange(): void {
    const pondType = Number(this.pondForm.get('pondType')?.value);

    if (pondType === PondType.POND) {
      this.showAdditionalFields = true;
      this.pondForm.get('radius')?.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      this.pondForm.get('length')?.clearValidators();
      this.pondForm.get('height')?.clearValidators();
    } else if (pondType === PondType.POOL) {
      this.showAdditionalFields = true;
      this.pondForm.get('length')?.setValidators([Validators.required, Validators.min(1), Validators.max(150)]);
      this.pondForm.get('height')?.setValidators([Validators.required, Validators.min(1)]);
      this.pondForm.get('radius')?.clearValidators();
    } else {
      this.showAdditionalFields = false;
    }

    this.pondForm.get('radius')?.updateValueAndValidity();
    this.pondForm.get('length')?.updateValueAndValidity();
    this.pondForm.get('height')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.pondForm.valid) {
      this.loading = true;
      const payload = {
        ...this.pondForm.value,
        waterType: Number(this.pondForm.value.waterType),
        pondType: Number(this.pondForm.value.pondType),
        aquacultureRut: this.data.aquacultureRut
      };

      this.poolService.createPool(payload).subscribe({
        next: () => {
          this.toastr.success('Estructura creada con éxito');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error('Error al crear la estructura: ' + err.message);
        }
      });
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos correctamente');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 