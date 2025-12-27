// src/services/experienceService.ts
import Api from "./Api";
import type { Experience, ExperienceResponse } from "@/types/experience";
import type { ApiResponse } from "@/types/common";

/**
 * Laravel paginator shape:
 * { current_page, per_page, total, data: [...] }
 * Kadang backend lain pakai "items" bukan "data"
 */
type Paginator<T> = {
    current_page?: number;
    per_page?: number;
    total?: number;
    data?: T[];
    items?: T[];
};

export const experienceService = {
    /**
     * Get experiences (supports Laravel paginator response)
     */
    async getAll(page = 1, search = ""): Promise<ExperienceResponse> {
        const res = await Api.get<ApiResponse<Paginator<Experience>>>("/api/admin/experiences", {
            params: { page, search },
        });

        const payload = res.data.data;

        const list: Experience[] = payload?.data ?? payload?.items ?? [];

        return {
            data: list,
            current_page: payload?.current_page ?? 1,
            per_page: payload?.per_page ?? 10,
            total: payload?.total ?? list.length,
        };
    },

    async getById(id: number | string): Promise<Experience> {
        const res = await Api.get<ApiResponse<Experience>>(`/api/admin/experiences/${id}`);
        return res.data.data;
    },

    async create(formData: FormData): Promise<ApiResponse<Experience>> {
        const res = await Api.post<ApiResponse<Experience>>("/api/admin/experiences", formData);
        return res.data;
    },

    async update(id: number | string, formData: FormData): Promise<ApiResponse<Experience>> {
        if (!formData.has("_method")) formData.append("_method", "PUT");

        const res = await Api.post<ApiResponse<Experience>>(`/api/admin/experiences/${id}`, formData);
        return res.data;
    },

    async delete(id: number | string): Promise<ApiResponse<null>> {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/experiences/${id}`);
        return res.data;
    },
};

export default experienceService;
