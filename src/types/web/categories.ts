import type { WebId } from "./shared";

export type WebCategory = {
  id: WebId;
  name: string;
  slug: string;
  image?: string | null;
};
