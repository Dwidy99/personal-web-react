import Api from "./Api";
import type { User, UserResponse, UserForm } from "@/types/admin/users";
import type { ApiResponse, ID } from "@/types/shared/api";

const userService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get<ApiResponse<UserResponse>>(`/api/admin/users`, {
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
        const res = await Api.get<ApiResponse<User>>(`/api/admin/users/${id}`);
        return res.data.data;
    },

    async create(data: UserForm) {
        const res = await Api.post<ApiResponse<User>>(`/api/admin/users`, data);
        return res.data;
    },

    async update(id: ID, data: UserForm) {
        const res = await Api.post<ApiResponse<User>>(
            `/api/admin/users/${id}`,
            { ...data, _method: "PUT" }
        );
        return res.data;
    },

    async delete(id: ID) {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/users/${id}`);
        return res.data;
    },
};

export default userService;
