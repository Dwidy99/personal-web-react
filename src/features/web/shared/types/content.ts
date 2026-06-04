import type { WebId } from "./api";

export type WebCategory = {
  id: WebId;
  name: string;
  slug: string;
  image?: string | null;
};

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

export type WebContact = {
  id: WebId;
  name: string;
  link: string;
  image?: string | null;
};

export type WebConfiguration = {
  icon?: string | null;
  logo?: string | null;
  site_name?: string | null;
};
