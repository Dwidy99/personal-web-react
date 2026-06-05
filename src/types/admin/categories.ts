import type { AdminValidationErrors } from "./shared";

export type AdminCategoryResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminCategoryMutationResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  image: string;
  created_at?: string;
  updated_at?: string;
};

export type AdminCategoryPagination = {
  current_page: number;
  per_page: number;
  total: number;
};

export type AdminCategoryListResult = AdminCategoryPagination & {
  data: AdminCategory[];
};

export type AdminCategoryFormErrors = AdminValidationErrors;
