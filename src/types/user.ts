import type { Role } from "./role";
import type { ID } from "./common";

export interface User {
    id: ID;
    name: string;
    email: string;
    roles: Role[];
    created_at?: string;
    updated_at?: string;
}

export interface UserForm {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    roles: string[];
}


export interface UserPagination {
    current_page: number;
    per_page: number;
    total: number;
    data: User[];
}

export interface UserResponse extends UserPagination { }

