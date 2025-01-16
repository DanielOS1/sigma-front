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
  email: string;
  rut: string;
}

export interface AquacultureDetail {
  name: string;
  email: string;
  rut: string;
  phoneNumber: string;
  centerAdminCultive: CenterAdmin;
  ownerUsers: OwnerUser[];
}

export interface AquacultureDetailResponse {
  message: string;
  data: AquacultureDetail;
  success: boolean;
}
