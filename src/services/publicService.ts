// src/services/publicService.ts
import Api from "./Api";
import { ApiResponse } from "../types/common";

// All public-facing API endpoints for the web pages
export const publicService = {
    getProfiles: async () => {
        const res = await Api.get<ApiResponse<any>>(`/api/public/profiles`);
        return res.data.data;
    },
    getExperiences: async () => {
        const res = await Api.get<ApiResponse<any>>(`/api/public/experiences`);
        return res.data.data;
    },
    getContacts: async () => {
        const res = await Api.get<ApiResponse<any>>(`/api/public/contacts`);
        return res.data.data.data; // adjust to your API structure
    },
    getPostsHome: async () => {
        const res = await Api.get<ApiResponse<any>>(`/api/public/posts_home`);
        return res.data.data;
    },
    getCategories: async () => {
        const res = await Api.get<ApiResponse<any>>(`/api/public/categories`);
        return res.data.data;
    },
    getPostDetail: async (slug: string) => {
        const res = await Api.get(`/api/public/posts/${slug}`);
        return res.data.data;
    },

    getPostsByCategory: async (slug: string, page = 1) => {
        const res = await Api.get(`/api/public/categories/${slug}/posts?page=${page}`);
        return res.data.data;
    },
    getPostBySlug: async (slug: string | undefined) => {
        if (!slug) return null;
        const res = await Api.get(`/api/public/posts/${slug}`);
        return res.data.data;
    },
    getProjects: async () => {
        const res = await Api.get("/api/public/projects");
        return res.data.data.data;
    },

    getProjectBySlug: async (slug: string | undefined) => {
        const res = await Api.get(`/api/public/projects/${slug}`);
        return res.data.data;
    },
};
