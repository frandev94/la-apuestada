import type { MockSafeUser, MockUser } from '../utils/test-helpers';

/**
 * Test fixtures for user-related data
 * Centralized test data management for consistent testing
 */

export const validUserData = {
  name: 'John Doe',
  password: 'securePassword123',
} as const;

export const invalidUserData = {
  emptyName: { name: '', password: 'password123' },
  shortPassword: { name: 'John Doe', password: '123' },
  missingName: { password: 'password123' },
  missingPassword: { name: 'John Doe' },
  specialCharsName: {
    name: 'John<>Invalid&Chars',
    password: 'password123',
  },
  // XSS test case - ONLY for controlled security testing
  xssAttempt: {
    name: 'User&lt;script&gt;alert(1)&lt;/script&gt;',
    password: 'password123',
  },
} as const;

export const mockUserRecords: MockUser[] = [
  {
    id: 1,
    name: 'Alice Smith',
    hashed_password: 'hashed_password_1',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    hashed_password: 'hashed_password_2',
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-02T11:00:00Z',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    hashed_password: 'hashed_password_3',
    createdAt: '2024-01-03T12:00:00Z',
    updatedAt: '2024-01-03T12:00:00Z',
  },
];

export const mockSafeUserRecords: MockSafeUser[] = mockUserRecords.map(
  (user): MockSafeUser => ({
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }),
);
