import Api from "./Api";
import type {
  AdminProfile,
  AdminProfileResponse,
} from "@/features/admin/profiles/types";

export const profileService = {
  async getByUserId(userId: number | string): Promise<AdminProfile | null> {
    const response = await Api.get<AdminProfileResponse<AdminProfile | null>>(
      `/api/admin/profiles/by-user/${userId}`,
    );

    return response.data.data ?? null;
  },

  async getMe(): Promise<AdminProfile | null> {
    const response = await Api.get<AdminProfileResponse<AdminProfile | null>>(
      "/api/admin/profiles/me",
    );

    return response.data.data ?? null;
  },

  async getById(profileId: number | string): Promise<AdminProfile | null> {
    const response = await Api.get<AdminProfileResponse<AdminProfile | null>>(
      `/api/admin/profiles/${profileId}`,
    );

    return response.data.data ?? null;
  },

  async update(
    profileId: number | string,
    formData: FormData,
  ): Promise<AdminProfileResponse<AdminProfile>> {
    if (!formData.has("_method")) formData.append("_method", "PUT");

    const response = await Api.post<AdminProfileResponse<AdminProfile>>(
      `/api/admin/profiles/${profileId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },
};

export default profileService;
