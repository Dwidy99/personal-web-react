import Api from "./Api";
import type {
  AdminCategory,
  AdminCategoryListResult,
  AdminCategoryMutationResponse,
  AdminCategoryResponse,
} from "@/types/admin/categories";

export const categoryService = {
  async getAll(page = 1, search = ""): Promise<AdminCategoryListResult> {
    const response = await Api.get<AdminCategoryResponse<AdminCategoryListResult>>(
      "/api/admin/categories",
      { params: { search, page } },
    );

    return response.data.data;
  },

  async getById(id: number): Promise<AdminCategory> {
    const response = await Api.get<AdminCategoryResponse<AdminCategory>>(
      `/api/admin/categories/${id}`,
    );

    return response.data.data;
  },

  async create(formData: FormData): Promise<AdminCategoryMutationResponse> {
    const response = await Api.post<AdminCategoryMutationResponse>(
      "/api/admin/categories",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async update(id: number, formData: FormData): Promise<AdminCategoryMutationResponse> {
    const response = await Api.post<AdminCategoryMutationResponse>(
      `/api/admin/categories/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async delete(id: number): Promise<AdminCategoryMutationResponse> {
    const response = await Api.delete<AdminCategoryMutationResponse>(
      `/api/admin/categories/${id}`,
    );

    return response.data;
  },
};

export default categoryService;
