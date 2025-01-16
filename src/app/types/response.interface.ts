import { User } from "../interfaces/users/usersDto";

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface UserData{
    rut: string;
    name: string;
    lastName: string;
    email: string;
    role: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    limit: number;
}



export interface UsersApiResponse {
    message: string;
    data: PaginatedUsers;
    success: boolean;
}


export interface PasswordResetRequest {
    id: string;
    user_rut: string;
    admin_rut: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface PasswordResetData {
    requests: PasswordResetRequest[];
    total: number;
}

export interface PasswordResetResponse {
    message: string;
    data: PasswordResetData;
    success: boolean;
}