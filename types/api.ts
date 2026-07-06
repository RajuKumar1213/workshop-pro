/**
 * Generic API response envelope — all API responses are normalized to this shape.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * Structured API error object.
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

/**
 * Pagination metadata returned with list responses.
 */
export interface ApiMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Pagination query parameters.
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
