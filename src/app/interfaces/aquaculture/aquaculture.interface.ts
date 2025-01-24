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
  centerAdminCultive?: {
    name: string;
    rut: string;
  };
  ownerUsers?: Array<{
    name: string;
    email: string;
    rut: string;
  }>;
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

export interface AquacultureDetailResponse {
  message: string;
  data: AquacultureDetail;
  success: boolean;
}

export interface Pool {
  ponds_id: number;
  ponds_depth: number;
  ponds_pondType: number;
  ponds_waterType: number;
  poollength: number;
  poolheight: number;
  pondradius?: number | null;
}
