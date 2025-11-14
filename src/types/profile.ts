// src/types/profile.ts
import { ID } from "./common";

/**
 * Struktur utama Profile seperti yang dikembalikan API
 */
export interface Profile {
    id: ID;
    user_id: ID;

    name: string;
    title: string;
    caption: string;
    image: string | null;

    about: string;
    description: string;
    content: string;
    tech_description: string;

    created_at?: string;
    updated_at?: string;
}

/**
 * Response API standar untuk satu atau beberapa profile
 */
export interface ProfileResponse {
    data: Profile[];
    current_page?: number;
    per_page?: number;
    total?: number;
}
