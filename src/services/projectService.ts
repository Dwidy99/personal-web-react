// src/services/projectService.ts
import Api from "./Api";
import type { ApiResponse } from "@/types/common";
import type { Project } from "@/types/project";

type Paginator<T> = {
    current_page?: number;
    per_page?: number;
    total?: number;
    data?: T[];  // Laravel paginate default
    items?: T[]; // fallback
};

export type ProjectListResult = {
    items: Project[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
    };
};

export const projectService = {
    /**
     * Get all projects (search + pagination)
     * Backend bisa return paginator Laravel -> data.data (array)
     * atau custom -> data.items
     */
    async getAll(page = 1, search = ""): Promise<ProjectListResult> {
        const res = await Api.get<ApiResponse<Paginator<Project>>>("/api/admin/projects", {
            params: { page, search },
        });

        const payload = res.data.data;

        const items = payload?.data ?? payload?.items ?? [];

        return {
            items,
            pagination: {
                current_page: payload?.current_page ?? page,
                per_page: payload?.per_page ?? 10,
                total: payload?.total ?? items.length,
            },
        };
    },

    async getById(id: number | string): Promise<Project> {
        const res = await Api.get<ApiResponse<Project>>(`/api/admin/projects/${id}`);
        return res.data.data;
    },

    async create(formData: FormData): Promise<ApiResponse<Project>> {
        const res = await Api.post<ApiResponse<Project>>("/api/admin/projects", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async update(id: number | string, formData: FormData): Promise<ApiResponse<Project>> {
        if (!formData.has("_method")) formData.append("_method", "PUT");

        const res = await Api.post<ApiResponse<Project>>(`/api/admin/projects/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async delete(id: number | string): Promise<ApiResponse<null>> {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/projects/${id}`);
        return res.data;
    },
};

export default projectService;
