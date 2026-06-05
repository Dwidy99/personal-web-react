import type { AdminValidationErrors } from "./shared";

export type AdminContactResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminContactMutationResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

export type AdminContact = {
  id: number;
  name: string;
  link: string;
  image: string;
};

export type AdminContactPagination = {
  current_page: number;
  per_page: number;
  total: number;
};

export type AdminContactListResult = AdminContactPagination & {
  data: AdminContact[];
};

export type AdminContactFormErrors = AdminValidationErrors;
