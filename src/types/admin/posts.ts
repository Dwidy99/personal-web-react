import type { AdminValidationErrors } from "./shared";

export type AdminPostCategory = {
  id: number;
  name: string;
  image?: string;
};

export type AdminPostAuthor = {
  id: number;
  name: string;
};

export type AdminPostResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminPostMutationResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

export type AdminPost = {
  id: number;
  title: string;
  content: string;
  image: string;
  slug: string;
  category_id: number;
  category?: AdminPostCategory;
  user?: AdminPostAuthor;
};

export type AdminPostPagination = {
  current_page: number;
  per_page: number;
  total: number;
};

export type AdminPostListResult = AdminPostPagination & {
  data: AdminPost[];
};

export type AdminPostFormErrors = AdminValidationErrors;

export type AdminPostCategoryOption = {
  id: number;
  name: string;
  image?: string;
};
