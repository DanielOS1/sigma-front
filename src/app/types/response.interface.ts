import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { User } from "../interfaces/entities/user.interface";
import { PasswordResetRequest } from "../interfaces/entities/user.interface";
import { AssignedAquaculture } from "../interfaces/entities/aquaculture.interface";
export interface ApiResponse<T> {
    message: string;
    data: T;
    success: boolean;
    total?: number;
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



export interface PasswordResetData {
    requests: PasswordResetRequest[];
    total: number;
    page: number;
    limit: number;
}

export interface PasswordResetResponse {
    message: string;
    data: PasswordResetData;
    success: boolean;
}

export interface LoginResponse {
    message: string;
    data: any;
    success: boolean;
  }

export interface LoginResponse2FA {
    token?: string;
    twoFactorEnabled?: boolean;
    role?: number;
  }

export interface LoginApiResponse {
    message: string;
    data: LoginResponse2FA;
    success: boolean;
}
export interface ApiPasswordResponse {
  message: string;
  data: {
    requests: PasswordResetRequest[];
    total: number;
    page: number;
    limit: number;
  };
  success: boolean;
}

export interface AssignedAquacultureResponse {
  message: string;
  data: AssignedAquaculture;
  success: boolean;
}


