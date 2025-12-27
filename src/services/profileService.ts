// src/services/profileService.ts
import Api from "./Api";
import type { ApiResponse } from "@/types/common";
import type { Profile } from "@/types/profile";

export const profileService = {
    // Ambil profile berdasarkan profile_id
    async getById(profileId: number): Promise<Profile> {
        const res = await Api.get<ApiResponse<Profile>>(
            `/api/admin/profiles/${profileId}`
        );
        return res.data.data;
    },

    // Update profile berdasarkan profile_id
    async update(profileId: number, data: FormData): Promise<ApiResponse<Profile>> {
        if (!data.has("_method")) {
            data.append("_method", "PUT");
        }

        const res = await Api.post<ApiResponse<Profile>>(
            `/api/admin/profiles/${profileId}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data;
    },
};

export default profileService;
