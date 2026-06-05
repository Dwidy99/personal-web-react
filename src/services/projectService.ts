import Api from "./Api";
import type {
  AdminProject,
  AdminProjectListResult,
  AdminProjectMutationResponse,
  AdminProjectPaginator,
  AdminProjectResponse,
} from "@/features/admin/projects/types";

export const projectService = {
  async getAll(page = 1, search = ""): Promise<AdminProjectListResult> {
    const response = await Api.get<AdminProjectResponse<AdminProjectPaginator<AdminProject>>>(
      "/api/admin/projects",
      { params: { page, search } },
    );

    const payload = response.data.data;
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

  async getById(id: number | string): Promise<AdminProject> {
    const response = await Api.get<AdminProjectResponse<AdminProject>>(
      `/api/admin/projects/${id}`,
    );

    return response.data.data;
  },

  async create(formData: FormData): Promise<AdminProjectMutationResponse> {
    const response = await Api.post<AdminProjectMutationResponse>(
      "/api/admin/projects",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async update(id: number | string, formData: FormData): Promise<AdminProjectMutationResponse> {
    if (!formData.has("_method")) formData.append("_method", "PUT");

    const response = await Api.post<AdminProjectMutationResponse>(
      `/api/admin/projects/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async delete(id: number | string): Promise<AdminProjectMutationResponse> {
    const response = await Api.delete<AdminProjectMutationResponse>(`/api/admin/projects/${id}`);

    return response.data;
  },
};

export default projectService;
