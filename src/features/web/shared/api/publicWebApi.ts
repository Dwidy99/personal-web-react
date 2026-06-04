import Api from "@/services/Api";
import type {
  WebApiResponse,
  WebCategory,
  WebConfiguration,
  WebContact,
  WebExperience,
  WebPaginatedResult,
  WebPaginationPayload,
  WebPost,
  WebProfile,
  WebProject,
} from "../types";

function listFromPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data;
  }

  return [];
}

function paginationFromPayload<T>(payload: WebPaginationPayload<T>): WebPaginatedResult<T> {
  return {
    current_page: payload.current_page ?? 1,
    per_page: payload.per_page ?? payload.data?.length ?? 0,
    total: payload.total ?? payload.data?.length ?? 0,
    last_page: payload.last_page,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
}

export const publicWebApi = {
  async getProfiles(): Promise<WebProfile[]> {
    const response = await Api.get<WebApiResponse<WebProfile[] | { data: WebProfile[] }>>(
      "/api/public/profiles"
    );

    return listFromPayload<WebProfile>(response.data.data);
  },

  async getExperiences(): Promise<WebExperience[]> {
    const response = await Api.get<WebApiResponse<WebExperience[] | { data: WebExperience[] }>>(
      "/api/public/experiences"
    );

    return listFromPayload<WebExperience>(response.data.data);
  },

  async getContacts(): Promise<WebContact[]> {
    const response = await Api.get<WebApiResponse<WebContact[] | { data: WebContact[] }>>(
      "/api/public/contacts"
    );

    return listFromPayload<WebContact>(response.data.data);
  },

  async getConfiguration(): Promise<WebConfiguration | null> {
    const response = await Api.get<WebApiResponse<WebConfiguration | null>>(
      "/api/public/configurations"
    );

    return response.data.data ?? null;
  },

  async getCategories(): Promise<WebCategory[]> {
    const response = await Api.get<WebApiResponse<WebCategory[] | { data: WebCategory[] }>>(
      "/api/public/categories"
    );

    return listFromPayload<WebCategory>(response.data.data);
  },

  async getPostsHome(): Promise<WebPost[]> {
    const response = await Api.get<WebApiResponse<WebPost[] | { data: WebPost[] }>>(
      "/api/public/posts_home"
    );

    return listFromPayload<WebPost>(response.data.data);
  },

  async getPosts(page = 1, perPage = 8): Promise<WebPaginatedResult<WebPost>> {
    const response = await Api.get<WebApiResponse<WebPaginationPayload<WebPost>>>(
      "/api/public/posts",
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    );

    return paginationFromPayload(response.data.data);
  },

  async getPostsByCategory(
    slug: string,
    page = 1
  ): Promise<{ category: WebCategory | null; posts: WebPaginatedResult<WebPost> }> {
    const response = await Api.get<
      WebApiResponse<{
        category: WebCategory | null;
        posts: WebPaginationPayload<WebPost>;
      }>
    >(`/api/public/categories/${slug}/posts`, {
      params: { page },
    });

    return {
      category: response.data.data.category ?? null,
      posts: paginationFromPayload(response.data.data.posts),
    };
  },

  async getPostBySlug(slug?: string): Promise<WebPost | null> {
    if (!slug) {
      return null;
    }

    const response = await Api.get<WebApiResponse<WebPost>>(`/api/public/posts/${slug}`);
    return response.data.data ?? null;
  },

  async getProjects(): Promise<WebProject[]> {
    const response = await Api.get<WebApiResponse<WebProject[] | { data: WebProject[] }>>(
      "/api/public/projects"
    );

    return listFromPayload<WebProject>(response.data.data);
  },

  async getProjectBySlug(slug?: string): Promise<WebProject | null> {
    if (!slug) {
      return null;
    }

    const response = await Api.get<WebApiResponse<WebProject>>(`/api/public/projects/${slug}`);
    return response.data.data ?? null;
  },
};
