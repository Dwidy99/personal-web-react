import Api from "./Api";
import Cookies from "js-cookie";
import { Contact } from "../types/contact";

const token = Cookies.get("token");

export const contactService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get(`/api/admin/contacts?search=${search}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async getById(id: number) {
        const res = await Api.get<{ data: Contact }>(`/api/admin/contacts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: FormData) {
        const res = await Api.post("/api/admin/contacts", data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async update(id: number, data: FormData) {
        const res = await Api.post(`/api/admin/contacts/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async delete(id: number) {
        const res = await Api.delete(`/api/admin/contacts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

// ✅ Tambahkan default export agar bisa diimport dari index.ts
export default contactService;
