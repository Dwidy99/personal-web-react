export interface Category {
    id: number;
    name: string;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export interface ValidationErrors {
    [key: string]: string[] | undefined;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
}
