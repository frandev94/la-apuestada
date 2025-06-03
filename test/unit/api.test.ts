import { describe, expect, it } from 'vitest';
import {
  calculatePagination,
  createErrorResponse,
  createPaginatedResponse,
  createSuccessResponse,
  parsePaginationParams,
  sanitizeUser,
  validateRequired,
} from '../../src/utils/api';
import type { User } from '../../src/utils/api.d';

describe('API Utils', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with default status 200', () => {
      const data = { message: 'Hello World' };
      const response = createSuccessResponse(data);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should create a success response with custom status', () => {
      const data = { id: 1 };
      const response = createSuccessResponse(data, 201);

      expect(response.status).toBe(201);
    });

    it('should create proper JSON body', async () => {
      const data = { test: 'value' };
      const response = createSuccessResponse(data);
      const body = await response.json();

      expect(body).toEqual({
        success: true,
        data: { test: 'value' },
      });
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with default status 500', () => {
      const response = createErrorResponse('ValidationError', 'Invalid input');

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should create an error response with custom status', () => {
      const response = createErrorResponse('NotFound', 'User not found', 404);

      expect(response.status).toBe(404);
    });

    it('should create proper JSON error body', async () => {
      const response = createErrorResponse('TestError', 'Test message', 400);
      const body = await response.json();

      expect(body).toEqual({
        success: false,
        error: 'TestError',
        message: 'Test message',
      });
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create a paginated response with default status 200', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const pagination = {
        total: 2,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should create a paginated response with custom status', () => {
      const items = [{ id: 1 }];
      const pagination = {
        total: 1,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination, 206);

      expect(response.status).toBe(206);
    });

    it('should create proper JSON paginated body', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const pagination = {
        total: 2,
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 1,
      };
      const response = createPaginatedResponse(items, pagination);
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
      const params = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual([]);
    });

    it('should detect undefined values', () => {
      const params = {
        name: 'John',
        email: undefined,
        age: 30,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['email']);
    });

    it('should detect null values', () => {
      const params = {
        name: 'John',
        email: null,
        age: 30,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['email']);
    });

    it('should detect empty string values', () => {
      const params = {
        name: '',
        email: 'john@example.com',
        age: 30,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['name']);
    });

    it('should detect multiple missing values', () => {
      const params = {
        name: '',
        email: undefined,
        age: null,
      };
      const missing = validateRequired(params);

      expect(missing).toEqual(['name', 'email', 'age']);
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
      const user: User = {
        id: 1,
        name: 'john_doe',
        hashed_password: 'secret_hash',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      const sanitized = sanitizeUser(user);

      expect(sanitized).toEqual({
        id: 1,
        name: 'john_doe',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      });
      expect(sanitized).not.toHaveProperty('hashed_password');
    });

    it('should preserve all other user properties', () => {
      const user: User = {
        id: 2,
        name: 'jane_doe',
        hashed_password: 'another_secret_hash',
        createdAt: '2023-02-01',
        updatedAt: '2023-02-01',
      };

      const sanitized = sanitizeUser(user);

      expect(sanitized.id).toBe(2);
      expect(sanitized.name).toBe('jane_doe');
      expect(sanitized.createdAt).toBe('2023-02-01');
      expect(sanitized.updatedAt).toBe('2023-02-01');
    });
  });
});
