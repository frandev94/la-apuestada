import { describe, expect, it } from 'vitest';
import {
  calculatePagination,
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
  parsePaginationParams,
  sanitizeUser,
  validateRequired,
} from '../../../src/lib/api';
import type { ApiResponse, PaginationMeta } from '../../../src/lib/api.d';
import { apiResponseFixtures } from '../../fixtures/api';
import {
  mockSafeUserRecords,
  mockUserRecords,
  validUserData,
} from '../../fixtures/users';

describe('API libs', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with default status 200', async () => {
      const response = createSuccessResponse(validUserData);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const json: ApiResponse<typeof validUserData> = await response.json();
      expect(json).toBeSuccessfulApiResponse();
      expect(json.data).toEqual(validUserData);
    });

    it('should create a success response with custom status', async () => {
      const response = createSuccessResponse(
        apiResponseFixtures.successResponse.data,
        201,
      );

      expect(response.status).toBe(201);

      const json: ApiResponse<typeof apiResponseFixtures.successResponse.data> =
        await response.json();
      expect(json).toBeSuccessfulApiResponse();
    });

    it('should create proper JSON body with fixture data', async () => {
      const response = createSuccessResponse(
        apiResponseFixtures.successResponse.data,
      );
      const body: ApiResponse<typeof apiResponseFixtures.successResponse.data> =
        await response.json();

      expect(body).toEqual(apiResponseFixtures.successResponse);
      expect(body).toBeSuccessfulApiResponse();
    });
  });

  describe('createErrorResponse', () => {
    it('should create validation error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.validationErrorResponse;
      const response = createErrorResponse(error, message, 400);
      const json: ApiResponse = await response.json();

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(json).toBeErrorApiResponse('VALIDATION_ERROR');
      expect(json).toEqual(apiResponseFixtures.validationErrorResponse);
    });

    it('should create not found error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.notFoundResponse;
      const response = createErrorResponse(error, message, 404);
      const json: ApiResponse = await response.json();

      expect(response.status).toBe(404);
      expect(json).toBeErrorApiResponse('NOT_FOUND');
      expect(json).toEqual(apiResponseFixtures.notFoundResponse);
    });

    it('should create internal error response using fixtures', async () => {
      const { error, message } = apiResponseFixtures.errorResponse;
      const response = createErrorResponse(error, message, 500);
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
      const expectedSanitized = mockSafeUserRecords[0];
      const sanitized = sanitizeUser(user);

      expect(sanitized).toBeValidUser();
      expect(sanitized).not.toHaveProperty('hashed_password');
      expect(sanitized).toEqual(expectedSanitized);
    });

    it('should preserve all other user properties', () => {
      const user = mockUserRecords[1];
      const expectedSanitized = mockSafeUserRecords[1];
      const sanitized = sanitizeUser(user);

      expect(sanitized).toBeValidUser();
      expect(sanitized).toEqual(expectedSanitized);
    });

    it('should work with multiple users', () => {
      const sanitizedUsers = mockUserRecords.map(sanitizeUser);
      expect(sanitizedUsers).toBeValidUserList();
      expect(sanitizedUsers).toEqual(mockSafeUserRecords);
    });
  });
});
