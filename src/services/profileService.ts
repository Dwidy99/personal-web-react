import Api from "./Api";
import Cookies from "js-cookie";
import { ApiResponse } from "@/types/common";
import { Profile } from "@/types/profile";


const token = Cookies.get("token");

export const profileService = {
    /**
     * Ambil data profile berdasarkan userId
     */
    async getByUserId(userId: number): Promise<Profile> {
        const res = await Api.get<ApiResponse<Profile>>(`/api/admin/profiles/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    /**
     * Update profile (gunakan FormData)
     */
    async update(userId: number, data: FormData): Promise<ApiResponse<Profile>> {
        data.append("_method", "PUT");
        const res = await Api.post<ApiResponse<Profile>>(`/api/admin/profiles/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },
};

export default profileService;
