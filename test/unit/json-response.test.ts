import { describe, expect, it } from 'vitest';
import { JsonResponse } from '../../src/utils/api';

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
      const response = JsonResponse.failure('ValidationError', 'Invalid input');

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
      const response = JsonResponse.failure('NotFound', 'User not found', 404);

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
