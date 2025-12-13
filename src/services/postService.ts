// src/services/postService.ts
import Api from "./Api";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export const postService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get(`/api/admin/posts?search=${search}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async getById(id: number) {
        const res = await Api.get(`/api/admin/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(formData: FormData) {
        const res = await Api.post("/api/admin/posts", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async update(id: number, formData: FormData) {
        const res = await Api.post(`/api/admin/posts/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async delete(id: number) {
        const res = await Api.delete(`/api/admin/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    async getCategories() {
        const res = await Api.get("/api/admin/categories/all", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },
};

export default postService;
