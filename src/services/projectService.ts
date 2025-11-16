// src/services/projectService.ts
import Api from "./Api";
import Cookies from "js-cookie";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import type { Project } from "@/types/project";

const token = Cookies.get("token");

const projectService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get<PaginatedResponse<Project>>("/api/admin/projects", {
            params: { page, search },
        });

        // handle dua kemungkinan struktur: data.items atau data.data
        const dataList = res.data.data.items || res.data.data.data || [];

        return {
            items: dataList,
            pagination: {
                current_page: res.data.data.current_page || 1,
                per_page: res.data.data.per_page || 10,
                total: res.data.data.total || dataList.length,
            },
        };
    },


    async getById(id: number | string): Promise<Project> {
        const res = await Api.get<ApiResponse<Project>>(`/api/admin/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async create(formData: FormData): Promise<ApiResponse<Project>> {
        const res = await Api.post<ApiResponse<Project>>("/api/admin/projects", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async update(id: number | string, formData: FormData): Promise<ApiResponse<Project>> {
        formData.append("_method", "PUT");
        const res = await Api.post<ApiResponse<Project>>(`/api/admin/projects/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    async delete(id: number | string): Promise<ApiResponse<null>> {
        const res = await Api.delete<ApiResponse<null>>(`/api/admin/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export default projectService;
