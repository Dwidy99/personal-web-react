import type { WebId } from "./shared";

export type WebProject = {
  id?: WebId;
  title?: string;
  slug?: string;
  caption?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  created_at?: string | null;
};
