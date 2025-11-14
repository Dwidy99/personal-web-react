import type { Permission } from "./permission";
import type { ID } from "./common";

export interface Role {
    id: ID;
    name: string;
    permissions: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface RoleForm {
    name: string;
    permissions: string[]; // array of permission names
}

export interface RoleResponse {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    items: Role[];
}
