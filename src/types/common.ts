export type ID = string | number;

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
    success: boolean;
    message?: string;
    data: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
        items?: T[];
        data?: T[];
    };
}


/**
 * Reusable status type for UI and model states
 */
export type Status = "draft" | "published" | "archived";
