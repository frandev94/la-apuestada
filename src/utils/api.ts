import type { ApiResponse, PaginationMeta, User } from './api.d';

/**
 * Create a success API response
 */
export function createSuccessResponse<T>(data: T, status = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    } as ApiResponse<T>),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: string,
  message: string,
  status = 500,
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error,
      message,
    } as ApiResponse),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * Create a paginated response with metadata
 */
export function createPaginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta,
  status = 200,
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        items,
        pagination,
      },
    } as ApiResponse<{ items: T[]; pagination: PaginationMeta }>),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * Parse and validate pagination parameters from URL search params
 */
export function parsePaginationParams(url: URL) {
  const limitParam = Number.parseInt(url.searchParams.get('limit') || '10');
  const offsetParam = Number.parseInt(url.searchParams.get('offset') || '0');

  const limit = Math.min(
    100,
    Math.max(1, Number.isNaN(limitParam) ? 10 : limitParam),
  );
  const offset = Math.max(0, Number.isNaN(offsetParam) ? 0 : offsetParam);
  const page = Math.floor(offset / limit) + 1;

  return { limit, offset, page };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  limit: number,
  offset: number,
): PaginationMeta {
  return {
    total,
    limit,
    offset,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Validate required parameters
 */
export function validateRequired<T>(params: Record<string, T>): string[] {
  const missing: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      missing.push(key);
    }
  }

  return missing;
}

/**
 * Sanitize user object by removing sensitive fields
 */
export function sanitizeUser(user: User) {
  const { hashed_password, ...safeUser } = user;
  return safeUser;
}

/**
 * JsonResponse class for creating JSON responses with proper headers
 * Provides a more convenient way to create standardized JSON responses
 */
export class JsonResponse extends Response {
  constructor(data: unknown, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');

    super(JSON.stringify(data), {
      ...init,
      headers,
    });
  }

  /**
   * Create a success JSON response
   */
  static success<T>(data: T, status = 200): JsonResponse {
    return new JsonResponse(
      {
        success: true,
        data,
      } as ApiResponse<T>,
      { status },
    );
  }

  /**
   * Create a failure JSON response
   */
  static failure(error: string, message: string, status = 500): JsonResponse {
    return new JsonResponse(
      {
        success: false,
        error,
        message,
      } as ApiResponse,
      { status },
    );
  }

  /**
   * Create a paginated JSON response
   */
  static paginated<T>(
    items: T[],
    pagination: PaginationMeta,
    status = 200,
  ): JsonResponse {
    return new JsonResponse(
      {
        success: true,
        data: {
          items,
          pagination,
        },
      } as ApiResponse<{ items: T[]; pagination: PaginationMeta }>,
      { status },
    );
  }
}
