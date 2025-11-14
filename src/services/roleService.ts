import Api from "./Api";
import Cookies from "js-cookie";
import type { Role, RoleResponse, RoleForm } from "@/types/role";
import type { ApiResponse, ID } from "@/types/common";

const token = Cookies.get("token");

const roleService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get<ApiResponse<RoleResponse>>(`/api/admin/roles`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, search },
        });
        const data = res.data.data;
        return {
            items: data.items || [],
            pagination: {
                current_page: data.current_page || 1,
                per_page: data.per_page || 10,
                total: data.total || 0,
            },
        };
    },

    async getById(id: ID) {
        const res = await Api.get<ApiResponse<Role>>(`/api/admin/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: RoleForm) {
        const res = await Api.post<ApiResponse<Role>>(`/api/admin/roles`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    async update(id: ID, data: RoleForm) {
        const res = await Api.post<ApiResponse<Role>>(
            `/api/admin/roles/${id}`,
            { ...data, _method: "PUT" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    async delete(id: ID) {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default roleService;
