// src/types/profile.ts
import type { ID } from "./common";

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
    created_at?: string | null;
    updated_at?: string | null;
}
