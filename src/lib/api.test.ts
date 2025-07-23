import { describe, expect, it } from 'vitest';
import {
  apiResponseFixtures,
  mockSafeUserRecords,
  mockUserRecords,
  validUserData,
} from '../__tests__/fixtures/users';
import {
  JsonResponse,
  calculatePagination,
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
  parsePaginationParams,
  sanitizeUser,
  validateRequired,
} from './api';
import type { ApiResponse, PaginationMeta } from './api.d';

describe('API libs', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with default status 200', async () => {
      const response = createSuccessResponse({ data: validUserData });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const json: ApiResponse<typeof validUserData> = await response.json();
      expect(json).toBeSuccessfulApiResponse();
      expect(json.data).toEqual(validUserData);
    });

    it('should create a success response with custom status', async () => {
      const response = createSuccessResponse({
        data: apiResponseFixtures.successResponse.data,
        status: 201,
      });

      expect(response.status).toBe(201);

      const json: ApiResponse<typeof apiResponseFixtures.successResponse.data> =
        await response.json();
      expect(json).toBeSuccessfulApiResponse();
    });

    it('should create proper JSON body with fixture data', async () => {
      const response = createSuccessResponse({
        data: apiResponseFixtures.successResponse.data,
      });
      const body: ApiResponse<typeof apiResponseFixtures.successResponse.data> =
        await response.json();

      expect(body).toEqual(apiResponseFixtures.successResponse);
      expect(body).toBeSuccessfulApiResponse();
    });
  });

  describe('createErrorResponse', () => {
    it('should create validation error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.validationErrorResponse;
      const response = createErrorResponse({ error, message, status: 400 });
      const json: ApiResponse = await response.json();

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(json).toBeErrorApiResponse('VALIDATION_ERROR');
      expect(json).toEqual(apiResponseFixtures.validationErrorResponse);
    });

    it('should create not found error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.notFoundResponse;
      const response = createErrorResponse({ error, message, status: 404 });
      const json: ApiResponse = await response.json();

      expect(response.status).toBe(404);
      expect(json).toBeErrorApiResponse('NOT_FOUND');
      expect(json).toEqual(apiResponseFixtures.notFoundResponse);
    });

    it('should create internal error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.errorResponse;
      const response = createErrorResponse({ error, message, status: 500 });
      const body: ApiResponse = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual(apiResponseFixtures.errorResponse);
      expect(body).toBeErrorApiResponse('INTERNAL_ERROR');
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create a paginated response with user fixtures', async () => {
      const items = mockSafeUserRecords;
      const pagination = {
        total: mockSafeUserRecords.length,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination);
      const json: ApiResponse<{
        items: typeof items;
        pagination: typeof pagination;
      }> & {
        data: NonNullable<
          ApiResponse<{
            items: typeof items;
            pagination: typeof pagination;
          }>['data']
        >;
      } = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(json).toBeSuccessfulApiResponse();
      expect(json.data).toHavePaginationStructure();
      expect(json.data.items).toBeValidUserList();
    });

    it('should create a paginated response with custom status', async () => {
      const items = mockSafeUserRecords.slice(0, 1);
      const pagination = {
        total: 1,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination, 206);
      const json: ApiResponse<{
        items: typeof items;
        pagination: PaginationMeta;
      }> = await response.json();

      expect(response.status).toBe(206);
      expect(json).toBeSuccessfulApiResponse();
      expect(json.data).toHavePaginationStructure();
    });

    it('should create proper JSON paginated body with fixtures', async () => {
      const items = mockSafeUserRecords;
      const pagination = {
        total: mockSafeUserRecords.length,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination);
      const body: ApiResponse<{
        items: typeof items;
        pagination: PaginationMeta;
      }> = await response.json();

      expect(body).toEqual({
        success: true,
        data: {
          items,
          pagination,
        },
      });
      expect(body).toBeSuccessfulApiResponse();
      expect(body.data).toHavePaginationStructure();
    });
  });

  describe('parsePaginationParams', () => {
    it('should parse default pagination parameters', () => {
      const url = new URL('http://example.com/users');
      const params = parsePaginationParams(url);

      expect(params).toEqual({
        limit: 10,
        offset: 0,
        page: 1,
      });
    });

    it('should parse custom limit and offset', () => {
      const url = new URL('http://example.com/users?limit=5&offset=15');
      const params = parsePaginationParams(url);

      expect(params).toEqual({
        limit: 5,
        offset: 15,
        page: 4, // Math.floor(15 / 5) + 1
      });
    });

    it('should enforce minimum limit of 1', () => {
      const url = new URL('http://example.com/users?limit=0');
      const params = parsePaginationParams(url);

      expect(params.limit).toBe(1);
    });

    it('should enforce maximum limit of 100', () => {
      const url = new URL('http://example.com/users?limit=200');
      const params = parsePaginationParams(url);

      expect(params.limit).toBe(100);
    });

    it('should enforce minimum offset of 0', () => {
      const url = new URL('http://example.com/users?offset=-5');
      const params = parsePaginationParams(url);

      expect(params.offset).toBe(0);
    });

    it('should handle invalid numeric values', () => {
      const url = new URL(
        'http://example.com/users?limit=invalid&offset=notanumber',
      );
      const params = parsePaginationParams(url);

      expect(params).toEqual({
        limit: 10, // default
        offset: 0, // default
        page: 1,
      });
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination for first page', () => {
      const pagination = calculatePagination(50, 10, 0);

      expect(pagination).toEqual({
        total: 50,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 5,
      });
    });

    it('should calculate pagination for middle page', () => {
      const pagination = calculatePagination(50, 10, 20);

      expect(pagination).toEqual({
        total: 50,
        limit: 10,
        offset: 20,
        page: 3,
        totalPages: 5,
      });
    });

    it('should calculate pagination for uneven total', () => {
      const pagination = calculatePagination(23, 10, 10);

      expect(pagination).toEqual({
        total: 23,
        limit: 10,
        offset: 10,
        page: 2,
        totalPages: 3, // Math.ceil(23 / 10)
      });
    });

    it('should handle edge cases', () => {
      const pagination = calculatePagination(0, 10, 0);

      expect(pagination).toEqual({
        total: 0,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 0,
      });
    });
  });

  describe('validateRequired', () => {
    it('should return empty array when all params are valid', () => {
      const missing = validateRequired(validUserData);
      expect(missing).toEqual([]);
    });

    it('should detect undefined values', () => {
      const params = {
        name: validUserData.name,
        email: undefined,
        password: validUserData.password,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['email']);
    });

    it('should detect null values', () => {
      const params = {
        name: validUserData.name,
        email: null,
        password: validUserData.password,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['email']);
    });

    it('should detect empty string values', () => {
      const params = {
        name: '',
        email: 'john@example.com',
        password: validUserData.password,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['name']);
    });

    it('should detect multiple missing values', () => {
      const params = {
        name: '',
        email: undefined,
        password: null,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['name', 'email', 'password']);
    });

    it('should handle falsy but valid values', () => {
      const params = {
        count: 0,
        isActive: false,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual([]);
    });
  });

  describe('sanitizeUser', () => {
    it('should remove hashed_password from user object', () => {
      const user = mockUserRecords[0];
      const expectedSanitized = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        isAdmin: user.isAdmin ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      const sanitized = sanitizeUser(user);
      expect(sanitized).toBeValidUser();
      expect(sanitized).toEqual(expectedSanitized);
    });

    it('should preserve all other user properties', () => {
      const user = mockUserRecords[1];
      const expectedSanitized = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        isAdmin: user.isAdmin ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      const sanitized = sanitizeUser(user);
      expect(sanitized).toBeValidUser();
      expect(sanitized).toEqual(expectedSanitized);
    });

    it('should work with multiple users', () => {
      const sanitizedUsers = mockUserRecords.map(sanitizeUser);
      const expectedSanitizedUsers = mockUserRecords.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        isAdmin: user.isAdmin ?? false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
      expect(sanitizedUsers).toBeValidUserList();
      expect(sanitizedUsers).toEqual(expectedSanitizedUsers);
    });
  });

  describe('JsonResponse', () => {
    it('should create a basic JSON response with proper headers', async () => {
      const data = { message: 'Hello World' };
      const response = new JsonResponse(data);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const body = await response.json();
      expect(body).toEqual(data);
    });

    it('should create a JSON response with custom status and headers', async () => {
      const data = { message: 'Created' };
      const response = new JsonResponse(data, {
        status: 201,
        headers: { 'X-Custom': 'test' },
      });

      expect(response.status).toBe(201);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('X-Custom')).toBe('test');
    });

    describe('JsonResponse.success', () => {
      it('should create a success response with default status 200', async () => {
        const data = { user: { id: 1, name: 'Test' } };
        const response = JsonResponse.success(data);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const body = await response.json();
        expect(body).toEqual({
          success: true,
          data,
        });
      });

      it('should create a success response with custom status', async () => {
        const data = { id: 1 };
        const response = JsonResponse.success(data, 201);

        expect(response.status).toBe(201);
      });
    });

    describe('JsonResponse.failure', () => {
      it('should create a failure response with default status 500', async () => {
        const response = JsonResponse.failure(
          'ValidationError',
          'Invalid input',
        );

        expect(response.status).toBe(500);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const body = await response.json();
        expect(body).toEqual({
          success: false,
          error: 'ValidationError',
          message: 'Invalid input',
        });
      });

      it('should create a failure response with custom status', async () => {
        const response = JsonResponse.failure(
          'NotFound',
          'User not found',
          404,
        );

        expect(response.status).toBe(404);
      });
    });

    describe('JsonResponse.paginated', () => {
      it('should create a paginated response', async () => {
        const items = [{ id: 1 }, { id: 2 }];
        const pagination = {
          total: 2,
          limit: 10,
          offset: 0,
          page: 1,
          totalPages: 1,
        };
        const response = JsonResponse.paginated(items, pagination);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');

        const body = await response.json();
        expect(body).toEqual({
          success: true,
          data: {
            items,
            pagination,
          },
        });
      });
    });
  });
});
