
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
    pools?: Array<{
      ponds_id: string;
      ponds_depth: number;
      ponds_pondType: number;
      ponds_waterType: number;
      poollength?: number;
      poolheight?: number;
      pondradius?: number | null;
    }>;
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
  
