import {
  createMockAPIContext,
  mockUsers,
  withSuppressedConsole,
} from '@/__tests__/utils/test-helpers.ts';
import type { ApiResponse, User as IUser } from '@/lib/api.d';
import { generateUUID } from '@/lib/crypto.ts';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/db/user-repository', () => ({
  getAllUsers: vi.fn(),
  searchUsersByName: vi.fn(),
  getUserById: vi.fn(),
  getUserByEmail: vi.fn(),
  getTotalUsers: vi.fn(),
}));

import {
  getAllUsers,
  getUserById,
  searchUsersByName,
} from '@/lib/db/user-repository';
import { GET as getUserByIdHandler } from './[id].ts';
import { GET as getUsersHandler } from './index.ts';

const mockGetAllUsers = getAllUsers as unknown as ReturnType<typeof vi.fn>;
const mockSearchUsersByName = searchUsersByName as unknown as ReturnType<
  typeof vi.fn
>;
const mockGetUserById = getUserById as unknown as ReturnType<typeof vi.fn>;

describe('Users API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllUsers.mockResolvedValue(mockUsers);
    mockSearchUsersByName.mockImplementation(async (name: string) =>
      mockUsers.filter((u) =>
        u.name.toLowerCase().includes(name.toLowerCase()),
      ),
    );
    mockGetUserById.mockImplementation(
      async (id: string) => mockUsers.find((u) => u.id === id) ?? null,
    );
  });

  test('should return all users without filters', async () => {
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
      const request = new Request('http://localhost/api/users?name=Alice');
      const context = createMockAPIContext(request);
      const response = await getUsersHandler(context);
      const { data, success, error, message }: ApiResponse<{ users: IUser[] }> =
        await response.json();

      expect(response.status).toBe(200);
      expect(success).toBe(true);
      expect(data?.users).toHaveLength(2);
      expect(data?.users.at(0)).toHaveProperty('name', 'Alice Smith');
      expect(data?.users.at(1)).toHaveProperty('name', 'Alice Brown');
      expect(error).toBeUndefined();
      expect(message).toBeUndefined();
      expect(mockSearchUsersByName).toHaveBeenCalledWith('Alice');
    });

    test('should apply pagination correctly', async () => {
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
      mockGetAllUsers.mockRejectedValueOnce(new Error('Database error'));
      const request = new Request('http://localhost/api/users');
      const context = createMockAPIContext(request);

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
      expect(mockGetUserById).toHaveBeenCalledWith(targetUser.id);
    });

    test('should return 404 when user does not exist', async () => {
      mockGetUserById.mockResolvedValueOnce(null);
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
      mockGetUserById.mockRejectedValueOnce(new Error('Database error'));
      const context = createMockAPIContext(
        new Request('http://localhost/api/users/1'),
        { id: generateUUID() },
      );

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
