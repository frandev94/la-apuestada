import type { MockSafeUser, MockUser } from '../utils/test-helpers';

/**
 * Test fixtures for user-related data
 * Centralized test data management for consistent testing
 */

export const testUserIds = {
  valid: 'user_1234567890123_abcd12345',
  pattern: /^user_\d{13}_[a-zA-Z0-9]{9}$/,
  localStorage: 'la-apuestada-user-id',
} as const;

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
    name: 'John<script>alert("xss")</script>',
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
  ({ hashed_password, ...user }) => user,
);

export const paginationTestCases = [
  {
    page: 1,
    limit: 10,
    totalUsers: 25,
    expectedOffset: 0,
    expectedTotalPages: 3,
  },
  {
    page: 2,
    limit: 10,
    totalUsers: 25,
    expectedOffset: 10,
    expectedTotalPages: 3,
  },
  {
    page: 3,
    limit: 10,
    totalUsers: 25,
    expectedOffset: 20,
    expectedTotalPages: 3,
  },
  {
    page: 1,
    limit: 5,
    totalUsers: 12,
    expectedOffset: 0,
    expectedTotalPages: 3,
  },
  {
    page: 1,
    limit: 20,
    totalUsers: 15,
    expectedOffset: 0,
    expectedTotalPages: 1,
  },
] as const;

export const apiResponseFixtures = {
  successResponse: {
    success: true,
    data: { message: 'Operation successful' },
  },
  errorResponse: {
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  },
  validationErrorResponse: {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Validation failed',
  },
  notFoundResponse: {
    success: false,
    error: 'NOT_FOUND',
    message: 'Resource not found',
  },
} as const;
