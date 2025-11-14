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

export interface UserResponse {
    current_page: number;
    last_page?: number;
    per_page: number;
    total: number;
    items: User[];
}
