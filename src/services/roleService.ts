import Api from "./Api";
import type { Role, RoleForm } from "@/types/role";
import type { ApiResponse, ID } from "@/types/common";

type RolePaginationResponse = {
  data: Role[];
  current_page: number;
  per_page: number;
  total: number;
};

const roleService = {
  async getAll(page = 1, search = "") {
    const res = await Api.get<ApiResponse<RolePaginationResponse>>("/api/admin/roles", {
      params: { page, search },
    });

    const data = res.data.data;

    return {
      items: data.data || [],
      pagination: {
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      },
    };
  },

  async getById(id: ID) {
    const res = await Api.get<ApiResponse<Role>>(`/api/admin/roles/${id}`);
    return res.data.data;
  },

  async create(data: RoleForm) {
    const res = await Api.post<ApiResponse<Role>>("/api/admin/roles", data);
    return res.data;
  },

  async update(id: ID, data: RoleForm) {
    const res = await Api.post<ApiResponse<Role>>(`/api/admin/roles/${id}`, {
      ...data,
      _method: "PUT",
    });
    return res.data;
  },

  async delete(id: ID) {
    const res = await Api.delete<ApiResponse<null>>(`/api/admin/roles/${id}`);
    return res.data;
  },
};

export default roleService;
