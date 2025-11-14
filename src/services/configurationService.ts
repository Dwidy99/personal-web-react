import Api from "./Api";
import Cookies from "js-cookie";
import { ConfigData } from "@/types/configuration";
import { ApiResponse } from "@/types/common";

const token = Cookies.get("token");

export const configurationService = {
    /**
     * Ambil konfigurasi berdasarkan userId
     */
    async getByUserId(userId: number): Promise<ConfigData> {
        const res = await Api.get<ApiResponse<ConfigData>>(
            `/api/admin/configurations/${userId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data.data;
    },

    /**
     * Update konfigurasi user (gunakan FormData)
     */
    async update(userId: number, data: FormData): Promise<ApiResponse<ConfigData>> {
        const res = await Api.post<ApiResponse<ConfigData>>(
            `/api/admin/configurations/${userId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    },
};

// ✅ Tambahkan default export agar bisa diimport dari index.ts
export default configurationService;
