import type { AdminValidationErrors } from "@/features/admin/shared/utils/apiError";

export type AdminExperienceResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminExperienceMutationResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

export type AdminExperience = {
  id: number;
  name: string;
  description: string;
  image?: string | null;
  start_date: string;
  end_date: string;
  profile_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type AdminExperiencePagination = {
  current_page: number;
  per_page: number;
  total: number;
};

export type AdminExperienceListResult = AdminExperiencePagination & {
  data: AdminExperience[];
};

export type AdminExperienceForm = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image: File | null;
};

export type AdminExperienceFormErrors = AdminValidationErrors;
