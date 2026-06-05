import type { WebId } from "./shared";

export type WebProfile = {
  id: WebId;
  name: string;
  title?: string | null;
  caption?: string | null;
  image?: string | null;
  about?: string | null;
  description?: string | null;
  content?: string | null;
  tech_description?: string | null;
};
