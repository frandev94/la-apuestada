import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  type MockDatabase,
  createMockAPIContext,
  mockUsers,
  withSuppressedConsole,
} from '../utils/test-helpers.js';

// Mock astro:db - inline creation to avoid hoisting issues
vi.mock('astro:db', () => {
  return {
    db: {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
    },
    User: { id: 'mock-user-id', name: 'mock-name' },
    eq: vi.fn(),
    like: vi.fn(),
    and: vi.fn(),
    or: vi.fn(),
  };
});

import { User, db, eq } from 'astro:db';
import { GET as getUserByIdHandler } from '../../src/pages/api/users/[id].ts';
import { GET as getUsersHandler } from '../../src/pages/api/users/index.ts';
import type { ApiResponse, User as IUser } from '../../src/utils/api.d';

// Type the mocked objects for better autocomplete and type safety
const mockDb = db as unknown as MockDatabase;
const mockUser = User;
const mockEq = eq as ReturnType<typeof vi.fn>;

describe('Users API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock chain to return itself for chaining
    mockDb.select.mockReturnValue(mockDb);
    mockDb.from.mockReturnValue(mockDb);
    mockDb.where.mockReturnValue(mockUsers);
  });

  test('should return all users without filters', async () => {
    mockDb.from.mockResolvedValue(mockUsers);

    const request = new Request('http://localhost/api/users');
    const context = createMockAPIContext(request);
    const response = await getUsersHandler(context);
    const data: ApiResponse<{ users: IUser[]; pagination: { total: number } }> =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.users).toHaveLength(3);
    expect(data.data?.users[0]).not.toHaveProperty('hashed_password');
    expect(data.data?.pagination.total).toBe(3);
  });

  describe('GET /api/users', () => {
    test('should filter users by name', async () => {
      mockDb.from.mockResolvedValue(mockUsers);

      const request = new Request('http://localhost/api/users?name=Alice');
      const context = createMockAPIContext(request);
      const response = await getUsersHandler(context);
      const data: ApiResponse<{ users: IUser[] }> = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.users).toHaveLength(2);
      expect(
        data.data?.users.every((user: IUser) => user.name.includes('Alice')),
      ).toBe(true);
    });

    test('should apply pagination correctly', async () => {
      mockDb.from.mockResolvedValue(mockUsers);

      const request = new Request(
        'http://localhost/api/users?limit=2&offset=0',
      );
      const context = createMockAPIContext(request);
      const response = await getUsersHandler(context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.users).toHaveLength(2);
      expect(data.data.pagination.limit).toBe(2);
      expect(data.data.pagination.offset).toBe(0);
      expect(data.data.pagination.page).toBe(1);
    });

    test('should handle database errors', async () => {
      mockDb.from.mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost/api/users');
      const context = createMockAPIContext(request);

      // Suppress console output for this known error test
      const response = await withSuppressedConsole(async () => {
        return await getUsersHandler(context);
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('GET /api/users/[id]', () => {
    test('should return user by ID', async () => {
      const targetUser = mockUsers[0];
      mockDb.where.mockResolvedValue([targetUser]);

      const context = createMockAPIContext(
        new Request('http://localhost/api/users/1'),
        { id: '1' },
      );
      const response = await getUserByIdHandler(context);
      const data: ApiResponse<{ user: IUser }> = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.user.id).toBe(1);
      expect(data.data?.user.name).toBe('Alice Smith');
      expect(data.data?.user).not.toHaveProperty('hashed_password');
      expect(mockEq).toHaveBeenCalledWith(mockUser.id, 1);
    });

    test('should return 404 when user does not exist', async () => {
      mockDb.where.mockResolvedValue([]);

      const context = createMockAPIContext(
        new Request('http://localhost/api/users/999'),
        { id: '999' },
      );
      const response = await getUserByIdHandler(context);
      const data: ApiResponse = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User not found');
      expect(data.message).toBe('No user found with ID 999');
    });

    test('should return 400 for invalid user ID', async () => {
      const context = createMockAPIContext(
        new Request('http://localhost/api/users/invalid'),
        { id: 'invalid' },
      );
      const response = await getUserByIdHandler(context);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid user ID');
      expect(data.message).toBe('User ID must be a valid number');
    });

    test('should handle database errors', async () => {
      mockDb.where.mockRejectedValue(new Error('Database error'));

      const context = createMockAPIContext(
        new Request('http://localhost/api/users/1'),
        { id: '1' },
      );

      // Suppress console output for this known error test
      const response = await withSuppressedConsole(async () => {
        return await getUserByIdHandler(context);
      });

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });
});
