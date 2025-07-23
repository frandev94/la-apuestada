import {
  type MockDatabase,
  createMockAPIContext,
  mockUsers,
  withSuppressedConsole,
} from '@/__tests__/utils/test-helpers.ts';
import { beforeEach, describe, expect, test, vi } from 'vitest';

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

import { User, db, eq, like } from 'astro:db';
import type { ApiResponse, User as IUser } from '@/lib/api.d';
import { generateUUID } from '@/lib/crypto.ts';
import { GET as getUserByIdHandler } from './[id].ts';
import { GET as getUsersHandler } from './index.ts';

// Type the mocked objects for better autocomplete and type safety
const mockDb = db as unknown as MockDatabase;
const mockUser = User;
const mockEq = eq as ReturnType<typeof vi.fn>;
const mockLike = like as ReturnType<typeof vi.fn>;

describe('Users API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock chain to return itself for chaining
    mockDb.select.mockReturnValue(mockDb);
    mockDb.from.mockReturnValue(mockDb);
    mockDb.where.mockReturnValue(mockDb);
    mockDb.limit.mockReturnValue(mockDb);
    mockDb.offset.mockReturnValue(mockUsers);

    // Mock the like function
    mockLike.mockReturnValue('like-condition');
  });

  test('should return all users without filters', async () => {
    // Mock the count query (returns all users for counting)
    mockDb.from.mockResolvedValueOnce(mockUsers);
    // Mock the paginated query (returns first 10 users)
    mockDb.offset.mockResolvedValueOnce(mockUsers);

    const request = new Request('http://localhost/api/users');
    const context = createMockAPIContext(request);
    const response = await getUsersHandler(context);
    const data: ApiResponse<{ users: IUser[]; pagination: { total: number } }> =
      await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data?.users).toHaveLength(3);
    expect(data.data?.users[0]).not.toHaveProperty('hashed_password');
    expect(data.data?.users[0]).toHaveProperty('email');
    expect(data.data?.users[0]).toHaveProperty('image');
    expect(data.data?.users[0]).toHaveProperty('isAdmin');
    expect(data.data?.pagination.total).toBe(3);
  });

  describe('GET /api/users', () => {
    test('should filter users by name', async () => {
      const filteredUsers = mockUsers.filter((user) =>
        user.name.toLowerCase().includes('alice'),
      );

      // Mock the count query for filtered results
      mockDb.where.mockResolvedValueOnce(filteredUsers);
      // Mock the paginated filtered query
      mockDb.offset.mockResolvedValueOnce(filteredUsers);

      const request = new Request('http://localhost/api/users?name=Alice');
      const context = createMockAPIContext(request);
      const response = await getUsersHandler(context);
      const { data, success, error, message }: ApiResponse<{ users: IUser[] }> =
        await response.json();

      expect(response.status).toBe(200);
      expect(success).toBe(true);
      expect(data?.users).toHaveLength(2);
      expect(data?.users.at(0)).toHaveProperty('name', filteredUsers[0].name);
      expect(data?.users.at(1)).toHaveProperty('name', filteredUsers[1].name);
      expect(error).toBeUndefined();
      expect(message).toBeUndefined();
      expect(mockLike).toHaveBeenCalledWith(mockUser.name, '%alice%');
    });

    test('should apply pagination correctly', async () => {
      // Mock the count query (returns all users for counting)
      mockDb.from.mockResolvedValueOnce(mockUsers);
      // Mock the paginated query (returns first 2 users)
      const paginatedUsers = mockUsers.slice(0, 2);
      mockDb.offset.mockResolvedValueOnce(paginatedUsers);

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
      expect(data.data.pagination.total).toBe(3);
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
      mockDb.limit.mockResolvedValueOnce([targetUser]);

      const context = createMockAPIContext(
        new Request(`http://localhost/api/users/${targetUser.id}`),
        { id: targetUser.id },
      );
      const response = await getUserByIdHandler(context);
      const data: ApiResponse<{ user: IUser }> = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.user.id).toBe(targetUser.id);
      expect(data.data?.user.name).toBe(targetUser.name);
      expect(data.data?.user).not.toHaveProperty('hashed_password');
      expect(mockEq).toHaveBeenCalledWith(mockUser.id, targetUser.id);
    });

    test('should return 404 when user does not exist', async () => {
      mockDb.limit.mockResolvedValue([]);

      const context = createMockAPIContext(
        new Request('http://localhost/api/users/999'),
        { id: generateUUID() },
      );
      const response = await getUserByIdHandler(context);
      const data: ApiResponse = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User not found');
      expect(data.message).toBe(`No user found with ID ${context.params.id}`);
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
      expect(data.message).toBe('Invalid uuid');
    });

    test('should handle database errors', async () => {
      mockDb.limit.mockRejectedValue(new Error('Database error'));

      const context = createMockAPIContext(
        new Request('http://localhost/api/users/1'),
        { id: generateUUID() },
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
