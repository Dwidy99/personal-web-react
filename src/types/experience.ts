export interface Experience {
    id: number;
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    profile_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ExperienceResponse {
    data: Experience[];
    current_page: number;
    per_page: number;
    total: number;
}
