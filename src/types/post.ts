export interface Post {
    id: number;
    title: string;
    content: string;
    image: string;
    category_id: number;
    category?: {
        id: number;
        name: string;
    };
    user?: {
        id: number;
        name: string;
    };
}

export interface ValidationErrors {
    [key: string]: string[] | undefined;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
}
