export interface Aquaculture {
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

export interface CenterAdmin {
  name: string;
  rut: string;
}

export interface OwnerUser {
  name: string;
  lastName?: string;
  email: string;
  rut: string;
}

export interface AquacultureDetail {
  name: string;
  email: string;
  rut: string;
  phoneNumber: string;
  centerAdminCultive: CenterAdmin | null;
  ownerUsers: OwnerUser[];
  
}

export interface AquacultureDetailResponse {
  message: string;
  data: {
    message: string;
    data: {
      name: string;
      email: string;
      rut: string;
      phoneNumber: string;
      centerAdminCultive: {
        name: string;
        rut: string;
      } | null;
      ownerUsers: {
        name: string;
        email: string;
        rut: string;
      }[];
    };
    success: boolean;
  };
  success: boolean;
}
