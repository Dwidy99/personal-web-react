// ✅ src/services/categoryService.ts
import Api from "./Api";
import Cookies from "js-cookie";
import { Category } from "../types/category";

const token = Cookies.get("token");

export const categoryService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get(`/api/admin/categories?search=${search}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async getById(id: number) {
        const res = await Api.get<{ data: Category }>(`/api/admin/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: FormData) {
        const res = await Api.post("/api/admin/categories", data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async update(id: number, data: FormData) {
        const res = await Api.post(`/api/admin/categories/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async delete(id: number) {
        const res = await Api.delete(`/api/admin/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default categoryService;
