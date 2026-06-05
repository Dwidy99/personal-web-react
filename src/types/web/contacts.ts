import type { WebId } from "./shared";

export type WebContact = {
  id: WebId;
  name: string;
  link: string;
  image?: string | null;
};
