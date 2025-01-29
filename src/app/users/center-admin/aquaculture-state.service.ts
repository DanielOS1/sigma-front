import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AquacultureEntity } from '../../interfaces/entities/aquaculture.interface';
import { OwnerUser } from '../../interfaces/entities/user.interface';
import { CenterAdmin } from '../../interfaces/entities/user.interface'; 


@Injectable({
  providedIn: 'root'
})
export class AquacultureStateService {
  private aquacultureDetails = new BehaviorSubject<AquacultureEntity | null>(null);
  private aquacultureOwner = new BehaviorSubject<OwnerUser[] | null>(null);
  private aquacultureAdmin = new BehaviorSubject<CenterAdmin | null>(null);

  // Observables
  aquacultureDetails$ = this.aquacultureDetails.asObservable();
  aquacultureOwner$ = this.aquacultureOwner.asObservable();
  aquacultureAdmin$ = this.aquacultureAdmin.asObservable();

  // Setters
  setAquacultureDetails(details: AquacultureEntity | null) {
    this.aquacultureDetails.next(details);
  }

  setAquacultureOwner(owner: OwnerUser[] | null) {
    this.aquacultureOwner.next(owner);
  }

  setAquacultureAdmin(admin: CenterAdmin | null) {
    this.aquacultureAdmin.next(admin);
  }

  // Optional: método para limpiar el estado
  clearState() {
    this.aquacultureDetails.next(null);
    this.aquacultureOwner.next(null);
    this.aquacultureAdmin.next(null);
  }
}