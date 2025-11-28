import { Permission } from "@/types/permission";
import Api from "./Api";
import Cookies from "js-cookie";

export interface ApiListResponse<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
}

// Reusable GET list with pagination service
export async function fetchList<T>(url: string, page: number, search: string) {
    const token = Cookies.get("token");

    const res = await Api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search },
    });

    const response = res.data.data;

    return {
        items: response.data as T[],
        pagination: {
            current_page: response.current_page,
            per_page: response.per_page,
            total: response.total,
        },
    };
}

const permissionService = {
    async getAll(page = 1, search = "") {
        return fetchList<Permission>("/api/admin/permissions", page, search);
    },
};

export default permissionService;