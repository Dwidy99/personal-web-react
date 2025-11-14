export interface Contact {
    id: number;
    name: string;
    link: string;
    image: string;
}

export interface ValidationErrors {
    [key: string]: string[] | undefined;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
}
