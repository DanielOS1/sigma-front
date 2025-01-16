

export interface BaseUser {
  name: string;
  lastName?: string;
  email: string;
  rut: string;
}

export interface CenterAdmin extends BaseUser {

}

export interface OwnerUser extends BaseUser {

}

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
    data: AquacultureDetail;
    success: boolean;
  };
  success: boolean;
}
