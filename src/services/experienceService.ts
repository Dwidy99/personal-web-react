import Api from "./Api";
import Cookies from "js-cookie";
import { Experience, ExperienceResponse } from "@/types/experience";
import { ApiResponse } from "../types/common";

const token = Cookies.get("token");

export const experienceService = {
    /**
     * Ambil daftar Experience dengan pagination dan search
     */
    async getAll(page = 1, search = ""): Promise<ExperienceResponse> {
        const res = await Api.get<ApiResponse<ExperienceResponse>>(
            "/api/admin/experiences",
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, search },
            }
        );
        return res.data.data;
    },

    /**
     * Ambil detail 1 Experience berdasarkan ID
     */
    async getById(id: number | string): Promise<Experience> {
        const res = await Api.get<ApiResponse<Experience>>(
            `/api/admin/experiences/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data;
    },

    /**
     * Tambah Experience baru
     */
    async create(formData: FormData): Promise<ApiResponse<Experience>> {
        const res = await Api.post<ApiResponse<Experience>>(
            "/api/admin/experiences",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    },

    /**
     * Update Experience (Edit)
     */
    async update(
        id: number | string,
        formData: FormData
    ): Promise<ApiResponse<Experience>> {
        formData.append("_method", "PUT");
        const res = await Api.post<ApiResponse<Experience>>(
            `/api/admin/experiences/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    },

    /**
     * Hapus Experience berdasarkan ID
     */
    async delete(id: number | string): Promise<ApiResponse<null>> {
        const res = await Api.delete<ApiResponse<null>>(
            `/api/admin/experiences/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    },
};

// ✅ default export agar bisa dipanggil dari services/index.ts
export default experienceService;
