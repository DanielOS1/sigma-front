import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PoolService } from '../../../services/pool.service';
import { WaterType, PondType } from '../../../interfaces/Pool/Pool.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-pool',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss'],
})
export class CreatePoolComponent implements OnInit {
  pondForm: FormGroup;
  WaterType = WaterType;
  PondType = PondType;
  showAdditionalFields: boolean = false; // Para mostrar campos adicionales dinámicamente

  constructor(
    private fb: FormBuilder,
    private poolService: PoolService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.pondForm = this.fb.group({
      aquacultureRut: ['', Validators.required],
      waterType: [null, Validators.required],
      depth: [null, [Validators.required, Validators.min(1), Validators.max(15)]],
      pondType: [null, Validators.required],
      radius: [null],
      length: [null],
      height: [null],
    });
  }

  ngOnInit(): void {
    console.log('Componente CreatePoolComponent inicializado');
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
  
    // Actualiza la validez de los campos
    this.pondForm.get('radius')?.updateValueAndValidity();
    this.pondForm.get('length')?.updateValueAndValidity();
    this.pondForm.get('height')?.updateValueAndValidity();
  
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }
  
  onSubmit(): void {
    if (this.pondForm.valid) {
      const payload = {
        ...this.pondForm.value,
        waterType: Number(this.pondForm.value.waterType), // Convertir a número
        pondType: Number(this.pondForm.value.pondType),   // Convertir a número
      };

      console.log("Payload a enviar:", payload); // Log para verificar el payload

      this.poolService.createPool(payload).subscribe({
        next: () => {
          this.toastr.success('Piscina creada con éxito');
          this.pondForm.reset();
          this.showAdditionalFields = false;
        },
        error: (err) => {
          this.toastr.error('Error al crear la piscina: ' + err.message);
        },
      });
    } else {
      this.toastr.error('Por favor, completa todos los campos requeridos');
    }
  }
}
