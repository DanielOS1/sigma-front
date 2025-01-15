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