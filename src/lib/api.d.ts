export interface User {
  id: number;
  name: string;
  hashed_password: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}
