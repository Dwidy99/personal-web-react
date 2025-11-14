import Api from "./Api";
import Cookies from "js-cookie";
import type { Permission } from "@/types/permission";
import type { ApiResponse } from "@/types/common";

const token = Cookies.get("token");

const permissionService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get<ApiResponse<any>>(`/api/admin/permissions`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, search },
        });
        const data = res.data.data;
        return {
            items: data.data || data.items || [],
            pagination: {
                current_page: data.current_page || 1,
                per_page: data.per_page || 10,
                total: data.total || 0,
            },
        };
    },
};

export default permissionService;
