import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PoolService } from '../../../services/pool.service';
import { WaterType, PondType } from '../../../interfaces/entities/pool.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './create-pool.component.html',
  styleUrls: ['./create-pool.component.scss'],
})
export class CreatePoolComponent implements OnInit {
  pondForm: FormGroup;
  WaterType = WaterType;
  PondType = PondType;
  showAdditionalFields: boolean = false; 
  aquacultureRut: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private poolService: PoolService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
    
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

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.aquacultureRut = params['rut'] || '';
      console.log('RUT recibido:', this.aquacultureRut);
      if (!this.aquacultureRut) {
        this.toastr.error('El RUT de la acuícola no fue proporcionado.');
      } else {
        console.log('RUT recibido:', this.aquacultureRut);
      }
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
  
    // Actualiza la validez de los campos
    this.pondForm.get('radius')?.updateValueAndValidity();
    this.pondForm.get('length')?.updateValueAndValidity();
    this.pondForm.get('height')?.updateValueAndValidity();
  
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }
  
  onSubmit(): void {
    if (this.pondForm.valid) {
      this.loading = true;
      const payload = {
        ...this.pondForm.value,
        waterType: Number(this.pondForm.value.waterType),
        pondType: Number(this.pondForm.value.pondType),
        aquacultureRut: this.aquacultureRut
      };
  
      this.poolService.createPool(payload).subscribe({
        next: () => {
          this.toastr.success('Estructura creada con éxito');
          this.loading = false;
          this.pondForm.reset();
          this.showAdditionalFields = false;
          this.router.navigate(['/system-admin/view-aquaculture']);
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

  cancelCreation(): void {
    this.pondForm.reset();
    this.showAdditionalFields = false;
    this.router.navigate(['/system-admin/view-aquaculture']);
  }
  
}
