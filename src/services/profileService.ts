import Api from "./Api";
import type { ApiResponse } from "@/types/common";
import type { Profile } from "@/types/profile";

export const profileService = {
    async getByUserId(userId: number | string): Promise<Profile | null> {
        const res = await Api.get<ApiResponse<Profile | null>>(
            `/api/admin/profiles/by-user/${userId}`
        );
        return res.data.data ?? null;
    },

    async getMe(): Promise<Profile | null> {
        const res = await Api.get<ApiResponse<Profile | null>>(`/api/admin/profiles/me`);
        return res.data.data ?? null;
    },

    async getById(profileId: number | string): Promise<Profile | null> {
        const res = await Api.get<ApiResponse<Profile | null>>(
            `/api/admin/profiles/${profileId}`
        );
        return res.data.data ?? null;
    },

    async update(profileId: number | string, formData: FormData): Promise<ApiResponse<Profile>> {
        if (!formData.has("_method")) formData.append("_method", "PUT");

        const res = await Api.post<ApiResponse<Profile>>(
            `/api/admin/profiles/${profileId}`,
            formData
        );

        return res.data;
    },
};

export default profileService;
