export interface Permission {
    id: number;
    name: string;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
}
