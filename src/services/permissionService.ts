import Api from "./Api";
import Cookies from "js-cookie";
import { Permission } from "@/types/permission";
import { ApiResponse } from "@/types/common";

const token = Cookies.get("token");

export const permissionService = {
    /**
     * Ambil daftar Permission dengan pagination & search
     */
    async getAll(
        page = 1,
        search = ""
    ): Promise<Permission[]> {
        const res = await Api.get<ApiResponse<{ data: Permission[] }>>(
            `/api/admin/permissions`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, search },
            }
        );

        return res.data.data.data; // disesuaikan dengan struktur API kamu
    },
};

// ✅ Tambahkan default export agar bisa diimport dari index.ts
export default permissionService;
