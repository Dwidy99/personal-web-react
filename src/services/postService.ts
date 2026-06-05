import Api from "./Api";
import type {
  AdminPost,
  AdminPostCategoryOption,
  AdminPostListResult,
  AdminPostMutationResponse,
  AdminPostResponse,
} from "@/types/admin/posts";

export const postService = {
  async getAll(page = 1, search = ""): Promise<AdminPostListResult> {
    const response = await Api.get<AdminPostResponse<AdminPostListResult>>(
      "/api/admin/posts",
      { params: { search, page } },
    );

    return response.data.data;
  },

  async getById(id: number): Promise<AdminPost> {
    const response = await Api.get<AdminPostResponse<AdminPost>>(`/api/admin/posts/${id}`);

    return response.data.data;
  },

  async create(formData: FormData): Promise<AdminPostMutationResponse> {
    const response = await Api.post<AdminPostMutationResponse>(
      "/api/admin/posts",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async update(id: number, formData: FormData): Promise<AdminPostMutationResponse> {
    const response = await Api.post<AdminPostMutationResponse>(
      `/api/admin/posts/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async delete(id: number): Promise<AdminPostMutationResponse> {
    const response = await Api.delete<AdminPostMutationResponse>(`/api/admin/posts/${id}`);

    return response.data;
  },

  async getCategories(): Promise<AdminPostCategoryOption[]> {
    const response = await Api.get<AdminPostResponse<AdminPostCategoryOption[]>>(
      "/api/admin/categories/all",
    );

    return response.data.data;
  },
};

export default postService;
