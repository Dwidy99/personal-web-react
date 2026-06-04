export type WebId = string | number;

export type WebApiResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  data: T;
};

export type WebPaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

export type WebPaginationPayload<T> = WebPaginationMeta & {
  data: T[];
};

export type WebPaginatedResult<T> = WebPaginationMeta & {
  data: T[];
};
