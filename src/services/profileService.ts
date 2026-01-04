// src/services/profileService.ts
import Api from "./Api";
import type { ApiResponse } from "@/types/common";
import type { Profile } from "@/types/profile";

export const profileService = {
    async getByUserId(userId: number): Promise<Profile | null> {
        const res = await Api.get<ApiResponse<Profile | null>>(`/api/admin/profiles/by-user/${userId}`);
        return res.data.data;
    },

    async update(profileId: number, data: FormData): Promise<ApiResponse<Profile>> {
        if (!data.has("_method")) data.append("_method", "PUT");

        const res = await Api.post<ApiResponse<Profile>>(
            `/api/admin/profiles/${profileId}`,
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        return res.data;
    },
};

export default profileService;
