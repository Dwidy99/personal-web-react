import Api from "./Api";
import type { ApiResponse, PaginatedResponse } from "@/types/common";
import type { User } from "@/types/user";
import type { ID } from "@/types/common";

/**
 * User Service – CRUD for Users
 */
export async function getUsers(
    page = 1
): Promise<PaginatedResponse<User>> {
    const res = await Api.get(`/users?page=${page}`);
    return res.data;
}

export async function getUserById(id: ID): Promise<ApiResponse<User>> {
    const res = await Api.get(`/users/${id}`);
    return res.data;
}

export async function createUser(
    data: Omit<User, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<User>> {
    const res = await Api.post("/users", data);
    return res.data;
}

export async function updateUser(
    id: ID,
    data: Partial<User>
): Promise<ApiResponse<User>> {
    const res = await Api.put(`/users/${id}`, data);
    return res.data;
}

export async function deleteUser(id: ID): Promise<ApiResponse<null>> {
    const res = await Api.delete(`/users/${id}`);
    return res.data;
}
