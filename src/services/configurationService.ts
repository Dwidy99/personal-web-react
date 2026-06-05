import Api from "./Api";
import type {
  AdminConfigurationData,
  AdminConfigurationResponse,
} from "@/types/admin/configurations";

export const configurationService = {
  async getByUserId(userId: number): Promise<AdminConfigurationData> {
    const response = await Api.get<AdminConfigurationResponse<AdminConfigurationData>>(
      `/api/admin/configurations/${userId}`,
    );

    return response.data.data;
  },

  async update(
    userId: number,
    data: FormData,
  ): Promise<AdminConfigurationResponse<AdminConfigurationData>> {
    if (!data.has("_method")) data.append("_method", "PUT");

    const response = await Api.post<AdminConfigurationResponse<AdminConfigurationData>>(
      `/api/admin/configurations/${userId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },
};

export default configurationService;
