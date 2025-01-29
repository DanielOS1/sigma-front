export interface BaseUser {
    rut?: string;
    name?: string;
    lastName?: string;
    email?: string;
    role?: number;
    twoStepAuth?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
}

//Dueño de centro de cultivo
export interface OwnerUser extends BaseUser {
    aquacultureRut?: string;
}

//Administrador de centro de cultivo
export interface CenterAdmin extends BaseUser {
    aquacultureRut?: string;
}

//Cientifico
export interface Scientist extends BaseUser {
    aquacultureRut?: string;
}

//Usuario Base
export type User = BaseUser | OwnerUser | Scientist | CenterAdmin;

export function isOwnerUser(user: User): user is OwnerUser {
    return user.role === 1; 
}


export interface PasswordResetRequest {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
    user: {
      rut: string;
      name: string;
      role: number;
    };
    admin: {
      rut: string;
      name: string;
      role: number;
    } | null;
  }
  

export enum UserRole {
    OWNER = 1,
    SCIENTIST = 2,
    AQUACULTURE_ADMIN = 3,
    SYSTEM_ADMIN = 4,
    SUPER_ADMIN = 5
} 


export interface AuditResponse {
    id: string;
    action: string;
    details: string;
    performedBy: string;
    performedAt: string;
}

export interface LoginTypeAdto {
    rut: string;
    deviceId: string;
}

export interface LoginTypeBdto {
    rut: string;
    password: string;
    deviceId: string;
}


export interface DecodedToken  {
    id: string;
    email: string;
    role: number;
    rut: string;
    iat: number;
    exp: number;
  }