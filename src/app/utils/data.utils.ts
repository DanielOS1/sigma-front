import { AquacultureEntity } from "../interfaces/entities/aquaculture.interface";
import { User } from "../interfaces/entities/user.interface";

export function mapUserData(serverData: any): User {
    return {
      rut: serverData.rut ?? '',
      name: serverData.name ?? '',
      lastName: serverData.lastName ?? '',
      email: serverData.email ?? '',
      role: serverData.role ?? 0,
      twoStepAuth: serverData.twoStepAuth ?? false,
      isActive: serverData.isActive ?? true,
      isDeleted: serverData.isDeleted ?? false,
      aquacultureRut: serverData.aquacultureRut ?? '', 
    };
}

  export function mapAquacultureData(serverData: any): AquacultureEntity {
    return {
      id: serverData.id ?? undefined,
      name: serverData.name ?? undefined,
      email: serverData.email ?? undefined,
      rut: serverData.rut ?? undefined,
      phoneNumber: serverData.phoneNumber ?? undefined,
      status: serverData.status ?? undefined,
    };
  }
