import type { ID } from "@/types/common";
import type { AdminValidationErrors } from "@/features/admin/shared/utils/apiError";

export type AdminProfileResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type AdminProfile = {
  id: ID;
  user_id: ID;
  name: string;
  title: string;
  caption: string;
  image: string | null;
  about: string;
  description: string;
  content: string;
  tech_description: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminProfileForm = {
  name: string;
  title: string;
  image: File | null;
  about: string;
  caption: string;
  description: string;
  content: string;
  tech_description: string;
};

export type AdminProfileEditorKey = "about" | "description" | "content" | "tech_description";

export type AdminProfileFormErrors = AdminValidationErrors;
