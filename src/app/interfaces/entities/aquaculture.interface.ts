import { AquaculturePonds, PoolDetails } from "./pool.interface";
import { AssignedScientist, PartialUser } from "./user.interface";

export interface Aquaculture {
    name: string;
    email: string;
    rut: string;
    phoneNumber: string;
  }


export interface AquacultureEntity{
  id: string;
  name: string;
  email: string;
  rut: string;
  phoneNumber: string;
  status: boolean;
}

  export interface AquacultureBasicDetails {
    id: string;
    name: string;
    email: string;
    rut: string;
    phoneNumber: string;
  }

  export interface CreateAquacultureDto {
    name: string;
    email: string;
    rut: string;
    phoneNumber: string;
  }
  

  export interface AquacultureDetail {
    id: string;
    name: string;
    email: string;
    rut: string;
    phoneNumber: string;
    centerAdminCultive: {
      name: string;
      rut: string;
    };
    ownerUsers: {
      name: string;
      rut: string;
    }[];
    aquaculturePonds: any[];
    pools?: PoolDetails[];
  }

  export interface AssignedAquaculture {
    assigned: boolean;
    aqData: AquacultureDetail;
  }
  
  export interface AquacultureScientists {
    aquacultureRut: string;
    scientists: {
      scientistRut: string;
      assignedBy: string;
      assignedAt: string;
    }[];
  }
  

  export interface AquacultureAssignmentsScientist {
    id: string;
    assigned_at: string;
    active: boolean;
    scientisRut: string;
    aquiferRut: string;
    assignedByRut: string;
  }


  export interface AquacultureAssignmentsScientistDetails {
    id: string;
    name: string;
    email: string;
    rut: string;
    phoneNumber: string;
    centerAdminCultive: PartialUser | null ;
    ownerUsers: PartialUser[] | null;
    assignedScientistsToAquaculture: {
      assignedBy: string;
      assignedAt: string;
      scientistName: string;
      scientistRut: string;
    }[] | null; 
    aquaculturePonds: AquaculturePonds[] | null; 
  }
