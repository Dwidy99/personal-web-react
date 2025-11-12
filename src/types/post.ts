import type { ID, Status } from "./common";
import type { User } from "./user";

export interface Category {
    id: ID;
    name: string;
    slug: string;
}

export interface Post {
    id: ID;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    category?: Category;
    author?: User;
    status?: Status;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PostFormData {
    title: string;
    slug: string;
    content: string;
    category_id: ID;
    status?: Status;
    thumbnail?: File | null;
}
