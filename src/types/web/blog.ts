import type { WebId } from "./shared";
import type { WebCategory } from "./categories";

export type WebAuthor = {
  id?: WebId;
  name?: string;
};

export type WebPost = {
  id: WebId;
  title: string;
  slug: string;
  content: string;
  image?: string | null;
  created_at?: string | null;
  excerpt?: string | null;
  category?: WebCategory | null;
  user?: WebAuthor | null;
};
