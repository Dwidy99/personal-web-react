// src/types/project.ts
import { ID } from "./common";

export interface Project {
    id: ID;
    title: string;
    description: string;
    caption: string;
    link: string;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ProjectResponse {
    data: Project[];
    current_page: number;
    per_page: number;
    total: number;
    last_page?: number;
}
