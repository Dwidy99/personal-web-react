export type ID = string | number;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

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

export type Status = "draft" | "published" | "archived";
