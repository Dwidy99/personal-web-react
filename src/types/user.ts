import type { ID } from "./common";

export interface User {
    id: ID;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    permissions?: string[];
    created_at?: string;
    updated_at?: string;
}
