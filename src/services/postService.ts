import Api from "./Api";
import type { ApiResponse, PaginatedResponse } from "@/types/common";
import type { Post, PostFormData } from "@/types/post";
import type { ID } from "@/types/common";

/**
 * Post Service – CRUD for Posts
 */
export async function getPosts(
    page = 1
): Promise<PaginatedResponse<Post>> {
    const res = await Api.get(`/posts?page=${page}`);
    return res.data;
}

export async function getPostById(id: ID): Promise<ApiResponse<Post>> {
    const res = await Api.get(`/posts/${id}`);
    return res.data;
}

export async function createPost(
    data: PostFormData
): Promise<ApiResponse<Post>> {
    // Jika mengandung file upload, ubah ke FormData
    const formData = new FormData();
    for (const key in data) {
        const value = data[key as keyof PostFormData];
        if (value !== undefined && value !== null)
            formData.append(key, value as any);
    }

    const res = await Api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function updatePost(
    id: ID,
    data: Partial<PostFormData>
): Promise<ApiResponse<Post>> {
    const formData = new FormData();
    for (const key in data) {
        const value = data[key as keyof PostFormData];
        if (value !== undefined && value !== null)
            formData.append(key, value as any);
    }

    const res = await Api.post(`/posts/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function deletePost(id: ID): Promise<ApiResponse<null>> {
    const res = await Api.delete(`/posts/${id}`);
    return res.data;
}
