import Api from "./Api";
import Cookies from "js-cookie";
import type { User, UserResponse, UserForm } from "@/types/user";
import type { ApiResponse, ID } from "@/types/common";

const token = Cookies.get("token");

const userService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get<ApiResponse<UserResponse>>(`/api/admin/users`, {
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
        const res = await Api.get<ApiResponse<User>>(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(data: UserForm) {
        const res = await Api.post<ApiResponse<User>>(`/api/admin/users`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },

    async update(id: ID, data: UserForm) {
        const res = await Api.post<ApiResponse<User>>(
            `/api/admin/users/${id}`,
            { ...data, _method: "PUT" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },

    async delete(id: ID) {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default userService;
