// src/services/baseService.ts

import Api from "./Api";
import Cookies from "js-cookie";

export interface ApiListResponse<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
}

/**
 * Generic fetch list function (reusable)
 * Works for all list endpoints: users, roles, permissions, posts, etc.
 */
export async function fetchList<T>(
    url: string,
    page: number,
    search: string
) {
    const token = Cookies.get("token");

    const res = await Api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search },
    });

    const payload = res.data.data;

    return {
        items: payload.data as T[],
        pagination: {
            current_page: payload.current_page,
            per_page: payload.per_page,
            total: payload.total,
        },
    };
}
