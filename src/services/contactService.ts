import Api from "./Api";
import type {
  AdminContact,
  AdminContactListResult,
  AdminContactMutationResponse,
  AdminContactResponse,
} from "@/features/admin/contacts/types";

export const contactService = {
  async getAll(page = 1, search = ""): Promise<AdminContactListResult> {
    const response = await Api.get<AdminContactResponse<AdminContactListResult>>(
      "/api/admin/contacts",
      { params: { search, page } },
    );

    return response.data.data;
  },

  async getById(id: number): Promise<AdminContact> {
    const response = await Api.get<AdminContactResponse<AdminContact>>(
      `/api/admin/contacts/${id}`,
    );

    return response.data.data;
  },

  async create(data: FormData): Promise<AdminContactMutationResponse> {
    const response = await Api.post<AdminContactMutationResponse>(
      "/api/admin/contacts",
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async update(id: number, data: FormData): Promise<AdminContactMutationResponse> {
    if (!data.has("_method")) data.append("_method", "PUT");

    const response = await Api.post<AdminContactMutationResponse>(
      `/api/admin/contacts/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },

  async delete(id: number): Promise<AdminContactMutationResponse> {
    const response = await Api.delete<AdminContactMutationResponse>(`/api/admin/contacts/${id}`);

    return response.data;
  },
};

export default contactService;
