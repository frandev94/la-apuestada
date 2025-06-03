import { describe, expect, test, vi } from 'vitest';
import type { ApiResponse } from '../../src/utils/api.d';
import {
  type MockUser,
  createMockAPIContext,
  createMockUser,
  createMockUsers,
  mockDbResponse,
} from '../utils/test-helpers.js';

/**
 * This test file demonstrates the benefits of using TypeScript types with mocks
 */
describe('Typed Mocks Example', () => {
  test('should demonstrate typed mock functions', () => {
    // Create a typed mock function with proper return type
    const mockUserService = vi.fn<(id: number) => Promise<MockUser>>();

    const testUser = createMockUser({ id: 1, name: 'John Doe' });
    mockUserService.mockResolvedValue(testUser);

    // TypeScript now knows the return type and provides autocomplete
    expect(mockUserService).toBeDefined();
    expect(vi.isMockFunction(mockUserService)).toBe(true);
  });

  test('should demonstrate typed user creation helpers', () => {
    // Create a single mock user with overrides
    const user = createMockUser({
      id: 42,
      name: 'Alice Johnson',
    });

    expect(user.id).toBe(42);
    expect(user.name).toBe('Alice Johnson');
    expect(user.hashed_password).toBe('hashed_password'); // default value
    expect(user.createdAt).toBeInstanceOf(Date);

    // Create multiple users
    const users = createMockUsers(3, { name: 'Test User' });

    expect(users).toHaveLength(3);
    expect(users[0].id).toBe(1);
    expect(users[1].id).toBe(2);
    expect(users[2].id).toBe(3);
    expect(users.every((u) => u.name.startsWith('Test User'))).toBe(true);
  });

  test('should demonstrate typed API responses', async () => {
    // Mock API context with proper typing
    const request = new Request('http://localhost/api/test');
    const context = createMockAPIContext(request, { id: '123' });

    // TypeScript knows the shape of the context
    expect(context.params.id).toBe('123');
    expect(context.request).toBe(request);
    expect(context.url.href).toBe('http://localhost/api/test');

    // Mock a typed API response
    const mockResponse: ApiResponse<{ user: MockUser }> = {
      success: true,
      data: {
        user: createMockUser({ id: 123, name: 'Response User' }),
      },
    };

    // TypeScript provides type safety for the response structure
    expect(mockResponse.success).toBe(true);
    expect(mockResponse.data?.user.id).toBe(123);
    expect(mockResponse.data?.user.name).toBe('Response User');
  });

  test('should demonstrate typed database responses', async () => {
    // Create mock database responses with proper typing
    const users = createMockUsers(2);
    const dbResponse = mockDbResponse(users);

    const result = await dbResponse;

    // TypeScript infers the correct type from the input
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('hashed_password');
  });

  test('should show benefits of type safety in error scenarios', () => {
    // Error response with proper typing
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Not found',
      message: 'User with ID 999 not found',
    };

    // TypeScript ensures we handle both success and error cases
    if (errorResponse.success) {
      // This block won't execute, but TypeScript knows errorResponse.data exists here
      expect(errorResponse.data).toBeDefined();
    } else {
      // TypeScript knows errorResponse.error exists here
      expect(errorResponse.error).toBe('Not found');
      expect(errorResponse.message).toBe('User with ID 999 not found');
    }
  });
});
