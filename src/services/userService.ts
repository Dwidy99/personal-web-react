import Api from "./Api";
import Cookies from "js-cookie";
import type { User, UserResponse, UserForm } from "@/types/user";
import type { ApiResponse, ID } from "@/types/common";

const userService = {
    async getAll(page = 1, search = "") {
        const token = Cookies.get("token");

        const res = await Api.get<ApiResponse<UserResponse>>(`/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, search },
        });

        const pagination = res.data.data;

        return {
            items: pagination.data || [],
            pagination: {
                current_page: pagination.current_page,
                per_page: pagination.per_page,
                total: pagination.total,
            },
        };
    },

    async getById(id: ID) {
        const token = Cookies.get("token");
        const res = await Api.get<ApiResponse<User>>(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: UserForm) {
        const token = Cookies.get("token");
        const res = await Api.post<ApiResponse<User>>(`/api/admin/users`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    async update(id: ID, data: UserForm) {
        const token = Cookies.get("token");
        const res = await Api.post<ApiResponse<User>>(
            `/api/admin/users/${id}`,
            { ...data, _method: "PUT" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    async delete(id: ID) {
        const token = Cookies.get("token");
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default userService;
