import type { ApiResponse, PaginationMeta, User } from './api.d';
import { cleanText, validateUserName } from './content-validation';

/**
 * Create a success API response
 */
export function createSuccessResponse<T>({
  data,
  message,
  status = 200,
}: { data: T; message?: string; status?: number }): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
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
export function createErrorResponse({
  error,
  message,
  status = 500,
}: { error: string; message: string; status?: number }): Response {
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
 * Sanitize user object by returning only allowed User fields
 * Also validates and cleans user name to prevent inappropriate content
 */
export function sanitizeUser(user: User) {
  const sanitizedName = user.name ? cleanText(user.name) : user.name;

  return {
    id: user.id,
    name: sanitizedName,
    email: user.email,
    image: user.image ?? null,
    isAdmin: user.isAdmin ?? false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Enhanced validation for user data including content validation
 */
export function validateUserData(userData: {
  name?: string;
  email?: string;
  [key: string]: unknown;
}): {
  isValid: boolean;
  errors: string[];
  sanitizedData: typeof userData;
} {
  const errors: string[] = [];
  const sanitizedData = { ...userData };

  // Validate required fields
  const missingFields = validateRequired({
    name: userData.name,
    email: userData.email,
  });

  if (missingFields.length > 0) {
    errors.push(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }

  // Validate name content if provided
  if (userData.name) {
    const nameValidation = validateUserName(userData.name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error || 'Nombre inválido');
    }
    sanitizedData.name = nameValidation.sanitizedName;
  }

  // Basic email validation
  if (userData.email && typeof userData.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      errors.push('Formato de email inválido');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
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
