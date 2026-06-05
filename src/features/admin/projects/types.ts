import type { ID } from "@/types/common";
import type { AdminValidationErrors } from "@/features/admin/shared/utils/apiError";

export type AdminProjectResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminProjectMutationResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

export type AdminProject = {
  id: ID;
  title: string;
  slug?: string;
  description: string;
  caption: string;
  link: string;
  image: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AdminProjectPaginator<T> = {
  current_page?: number;
  per_page?: number;
  total?: number;
  data?: T[];
  items?: T[];
};

export type AdminProjectListResult = {
  items: AdminProject[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
  };
};

export type AdminProjectFormErrors = AdminValidationErrors;
