import Api from "./Api";
import type {
    AdminPost,
    AdminPostCategoryOption,
    AdminPostListResult,
} from "@/features/admin/posts/types";

export const postService = {
    async getAll(page = 1, search = ""): Promise<AdminPostListResult> {
        const res = await Api.get(`/api/admin/posts`, {
            params: { search, page },
        });
        return res.data.data;
    },

    async getById(id: number): Promise<AdminPost> {
        const res = await Api.get(`/api/admin/posts/${id}`);
        return res.data.data;
    },

    async create(formData: FormData) {
        const res = await Api.post("/api/admin/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async update(id: number, formData: FormData) {
        const res = await Api.post(`/api/admin/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async delete(id: number) {
        const res = await Api.delete(`/api/admin/posts/${id}`);
        return res.data;
    },

    async getCategories(): Promise<AdminPostCategoryOption[]> {
        const res = await Api.get("/api/admin/categories/all");
        return res.data.data;
    },
};

export default postService;
