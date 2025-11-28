import Api from "./Api";
import Cookies from "js-cookie";
import type { Role, RoleResponse, RoleForm } from "@/types/role";
import type { ApiResponse, ID } from "@/types/common";

const roleService = {
    async getAll(page = 1, search = "") {
        const token = Cookies.get("token");

        const res = await Api.get(`/api/admin/roles`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, search },
        });

        const data = res.data.data; // backend "data"

        return {
            items: data.data || [],                 // array of roles
            pagination: {
                current_page: data.current_page,
                per_page: data.per_page,
                total: data.total,
            }
        };
    },

    async getById(id: ID) {
        const token = Cookies.get("token"); // ✔ always fresh
        const res = await Api.get<ApiResponse<Role>>(`/api/admin/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: RoleForm) {
        const token = Cookies.get("token"); // ✔ always fresh
        const res = await Api.post<ApiResponse<Role>>(`/api/admin/roles`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    async update(id: ID, data: RoleForm) {
        const token = Cookies.get("token"); // ✔ always fresh
        const res = await Api.post<ApiResponse<Role>>(
            `/api/admin/roles/${id}`,
            { ...data, _method: "PUT" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    async delete(id: ID) {
        const token = Cookies.get("token"); // ✔ always fresh
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default roleService;
