import Api from "./Api";
import type {
  AdminExperience,
  AdminExperienceListResult,
  AdminExperienceMutationResponse,
  AdminExperienceResponse,
} from "@/types/admin/experiences";

type Paginator<T> = {
  current_page?: number;
  per_page?: number;
  total?: number;
  data?: T[];
  items?: T[];
};

export const experienceService = {
  async getAll(page = 1, search = ""): Promise<AdminExperienceListResult> {
    const response = await Api.get<AdminExperienceResponse<Paginator<AdminExperience>>>(
      "/api/admin/experiences",
      { params: { page, search } },
    );

    const payload = response.data.data;
    const list = payload?.data ?? payload?.items ?? [];

    return {
      data: list,
      current_page: payload?.current_page ?? 1,
      per_page: payload?.per_page ?? 10,
      total: payload?.total ?? list.length,
    };
  },

  async getById(id: number | string): Promise<AdminExperience> {
    const response = await Api.get<AdminExperienceResponse<AdminExperience>>(
      `/api/admin/experiences/${id}`,
    );

    return response.data.data;
  },

  async create(formData: FormData): Promise<AdminExperienceMutationResponse> {
    const response = await Api.post<AdminExperienceMutationResponse>(
      "/api/admin/experiences",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async update(id: number | string, formData: FormData): Promise<AdminExperienceMutationResponse> {
    if (!formData.has("_method")) {
      formData.append("_method", "PUT");
    }

    const response = await Api.post<AdminExperienceMutationResponse>(
      `/api/admin/experiences/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async delete(id: number | string): Promise<AdminExperienceMutationResponse> {
    const response = await Api.delete<AdminExperienceMutationResponse>(
      `/api/admin/experiences/${id}`,
    );

    return response.data;
  },
};

export default experienceService;
