export interface BaseUser {
    rut: string;
    name: string;
    lastName: string;
    email: string;
    role: number;
}

export interface OwnerUser extends BaseUser {
    aquacultureRut: string;
}

export type user = BaseUser | OwnerUser;

export function isOwnerUser(user: user): user is OwnerUser {
    return user.role === 1; // Asumiendo que 1 es UserRole.OWNER
}