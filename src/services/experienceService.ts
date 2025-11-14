import Api from "./Api";
import Cookies from "js-cookie";
import { Experience, ExperienceResponse } from "@/types/experience";
import { ApiResponse } from "../types/common";

// Ambil token sekali agar tidak duplikat di setiap request
const token = Cookies.get("token");

/**
 * Ambil daftar Experience dengan pagination dan search
 */
export async function getAllExperiences(
    page: number = 1,
    search: string = ""
): Promise<ExperienceResponse> {
    const response = await Api.get<ApiResponse<ExperienceResponse>>(
        "/api/admin/experiences",
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, search },
        }
    );
    return response.data.data;
}

/**
 * Ambil detail 1 Experience berdasarkan ID
 */
export async function getExperienceById(id: number | string): Promise<Experience> {
    const response = await Api.get<ApiResponse<Experience>>(
        `/api/admin/experiences/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
}

/**
 * Tambah Experience baru (Create)
 */
export async function createExperience(formData: FormData): Promise<ApiResponse<Experience>> {
    const response = await Api.post<ApiResponse<Experience>>(
        "/api/admin/experiences",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}

/**
 * Update Experience (Edit)
 * Gunakan FormData dengan field `_method=PUT`
 */
export async function updateExperience(
    id: number | string,
    formData: FormData
): Promise<ApiResponse<Experience>> {
    formData.append("_method", "PUT");
    const response = await Api.post<ApiResponse<Experience>>(
        `/api/admin/experiences/${id}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}

/**
 * Hapus Experience berdasarkan ID
 */
export async function deleteExperience(id: number | string): Promise<ApiResponse<null>> {
    const response = await Api.delete<ApiResponse<null>>(
        `/api/admin/experiences/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
}
