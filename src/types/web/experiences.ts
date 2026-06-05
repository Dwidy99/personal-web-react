import type { WebId } from "./shared";

export type WebExperience = {
  id: WebId;
  name?: string;
  title?: string;
  company?: string;
  image?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};
