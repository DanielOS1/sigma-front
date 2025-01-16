export interface BaseUser {
    rut: string;
    name: string;
    lastName: string;
    email: string;
    role: number;
    isActive: boolean;
    isDeleted: boolean;
}

export interface OwnerUser extends BaseUser {
    aquacultureRut: string;
}

export interface CenterAdmin extends BaseUser {
    aquacultureRut: string;
}

export type User = BaseUser | OwnerUser;

export function isOwnerUser(user: User): user is OwnerUser {
    return user.role === 1; // Asumiendo que 1 es UserRole.OWNER
}