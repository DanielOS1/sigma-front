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