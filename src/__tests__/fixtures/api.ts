/**
 * API endpoint test fixtures
 * Common test data for API endpoint testing
 */

export const apiEndpointFixtures = {
  endpoints: [
    {
      path: '/api',
      method: 'GET',
      description: 'API information and available endpoints',
    },
    {
      path: '/api/users',
      method: 'GET',
      description: 'List all users with pagination',
    },
    {
      path: '/api/users',
      method: 'POST',
      description: 'Create a new user',
    },
    {
      path: '/api/users/[id]',
      method: 'GET',
      description: 'Get user by ID',
    },
    {
      path: '/api/users/[id]',
      method: 'PUT',
      description: 'Update user by ID',
    },
    {
      path: '/api/users/[id]',
      method: 'DELETE',
      description: 'Delete user by ID',
    },
  ],
} as const;

export const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const contentTypes = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const;

export const apiResponseFixtures = {
  successResponse: {
    success: true,
    data: { message: 'Operation successful' },
  },
  errorResponse: {
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  },
  validationErrorResponse: {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Validation failed',
  },
  notFoundResponse: {
    success: false,
    error: 'NOT_FOUND',
    message: 'Resource not found',
  },
} as const;
