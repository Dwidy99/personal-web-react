export type ID = string | number;

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
