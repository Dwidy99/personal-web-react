// src/services/userService.ts
import Api from "./Api";
import type { ApiResponse, PaginatedResponse, ID } from "@/types/common";
import type { User } from "@/types/user";

export const userService = {
    async getUsers(page = 1): Promise<PaginatedResponse<User>> {
        const res = await Api.get(`/users?page=${page}`);
        return res.data;
    },

    async getUserById(id: ID): Promise<ApiResponse<User>> {
        const res = await Api.get(`/users/${id}`);
        return res.data;
    },

    async createUser(data: Omit<User, "id" | "created_at" | "updated_at">): Promise<ApiResponse<User>> {
        const res = await Api.post("/users", data);
        return res.data;
    },

    async updateUser(id: ID, data: Partial<User>): Promise<ApiResponse<User>> {
        const res = await Api.put(`/users/${id}`, data);
        return res.data;
    },

    async deleteUser(id: ID): Promise<ApiResponse<null>> {
        const res = await Api.delete(`/users/${id}`);
        return res.data;
    },
};

export default userService;
