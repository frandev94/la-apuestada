import type { ApiResponse } from '@/lib/api.d';
import type { UserRecord } from '@/lib/db/user-repository';
import type { APIContext } from 'astro';
import { expect, vi } from 'vitest';

// Type definitions for better type safety
export type MockUser = UserRecord;

export interface MockSafeUser {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockDatabase {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  offset: ReturnType<typeof vi.fn>;
}

export interface MockDbUtils {
  db: MockDatabase;
  User: { id: string; name: string };
  eq: ReturnType<typeof vi.fn>;
  like: ReturnType<typeof vi.fn>;
  and: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
}

/**
 * Temporarily suppress console output during test execution
 * Useful for testing error scenarios where console.error is expected
 */
export const suppressConsole = () => {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  console.error = vi.fn();
  console.warn = vi.fn();
  console.log = vi.fn();

  return {
    restore: () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    },
    getErrorCalls: () => (console.error as ReturnType<typeof vi.fn>).mock.calls,
    getWarnCalls: () => (console.warn as ReturnType<typeof vi.fn>).mock.calls,
    getLogCalls: () => (console.log as ReturnType<typeof vi.fn>).mock.calls,
  };
};

/**
 * Wrapper function to run a test with suppressed console output
 */
export const withSuppressedConsole = async <T>(
  testFn: () => Promise<T> | T,
): Promise<T> => {
  const consoleSuppressor = suppressConsole();
  try {
    return await testFn();
  } finally {
    consoleSuppressor.restore();
  }
};

/**
 * Creates a mock APIContext for testing Astro API routes
 */
export const createMockAPIContext = <
  T extends Record<string, unknown> = Record<string, string>,
>(
  request: Request,
  params: T = {} as T,
): APIContext => {
  const url = new URL(request.url);
  return {
    request,
    params,
    url,
    site: new URL('http://localhost'),
    generator: 'astro',
    props: {},
    redirect: vi.fn(),
    locals: {},
    clientAddress: '127.0.0.1',
    cookies: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
      merge: vi.fn(),
      headers: vi.fn(),
    },
    getActionResult: vi.fn(),
    callAction: vi.fn(),
    preferredLocale: undefined,
    preferredLocaleList: [],
    currentLocale: undefined,
    rewrite: vi.fn(),
    routePattern: '/api/test',
    originPathname: '/api/test',
    isPrerendered: false,
  } as unknown as APIContext;
};

/**
 * Mock database factory for astro:db
 */
export const createMockDatabase = (): MockDbUtils => {
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
};

/**
 * Common test data
 */
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    image: 'https://example.com/alice.png',
    isAdmin: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    image: 'https://example.com/bob.png',
    isAdmin: true,
    createdAt: new Date('2024-01-02T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  },
  {
    id: '3',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    image: null,
    isAdmin: false,
    createdAt: new Date('2024-01-03T00:00:00Z'),
    updatedAt: new Date('2024-01-03T00:00:00Z'),
  },
];

/**
 * Safe user data (without password)
 */
export const mockSafeUsers: MockSafeUser[] = mockUsers.map((user) => ({
  ...user,
  id: Number(user.id),
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
}));

/**
 * Helper to create mock HTTP responses
 */
export const createMockResponse = <T>(data: T, status = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Helper to assert API response structure
 */
export const expectAPIResponse = <T>(
  response: ApiResponse<T>,
  success = true,
): void => {
  expect(response).toHaveProperty('success', success);
  if (success) {
    expect(response).toHaveProperty('data');
  } else {
    expect(response).toHaveProperty('error');
  }
};

/**
 * Helper to create test request with query parameters
 */
export const createTestRequest = (
  url: string,
  params?: Record<string, string>,
): Request => {
  const testUrl = new URL(url, 'http://localhost');
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      testUrl.searchParams.set(key, value);
    }
  }
  return new Request(testUrl.toString());
};

/**
 * Creates a typed mock function with proper return type
 */
export const createTypedMock = <
  T extends (...args: unknown[]) => unknown,
>(): T => {
  return vi.fn() as unknown as T;
};

/**
 * Helper to create a mock user with specific properties
 */
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => {
  return {
    id: '1',
    name: 'Test User',
    email: 'test.user@example.com',
    image: null,
    isAdmin: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
};

/**
 * Helper to create multiple mock users
 */
export const createMockUsers = (
  count: number,
  baseUser: Partial<MockUser> = {},
): MockUser[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: String(index + 1),
      name: `User ${index + 1}`,
      ...baseUser,
    }),
  );
};

/**
 * Type-safe mock database response helper
 */
export const mockDbResponse = <T>(data: T) => {
  return Promise.resolve(data);
};
