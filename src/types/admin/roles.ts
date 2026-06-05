import type { ID } from "@/types/shared/api";
import type { Permission } from "./permissions";

export interface Role {
  id: ID;
  name: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleForm {
  name: string;
  permissions: string[];
}

export interface RoleResponse {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  items: Role[];
}
