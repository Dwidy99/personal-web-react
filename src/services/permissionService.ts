import Api from "./Api";
import type { Permission } from "@/types/admin/permissions";
import type { ApiResponse } from "@/types/shared/api";

type ApiListResponse<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
};

async function fetchList<T>(url: string, page: number, search: string) {
  const res = await Api.get<ApiResponse<ApiListResponse<T>>>(url, {
    params: { page, search },
  });

  const response = res.data.data;

  return {
    items: response.data || [],
    pagination: {
      current_page: response.current_page,
      per_page: response.per_page,
      total: response.total,
    },
  };
}

const permissionService = {
  async getAll(page = 1, search = "") {
    return fetchList<Permission>("/api/admin/permissions", page, search);
  },
};

export default permissionService;
