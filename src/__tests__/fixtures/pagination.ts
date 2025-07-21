/**
 * Test fixtures for pagination-related data
 * Centralized pagination test data management
 */

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

export const parsePaginationTestCases = {
  pageCalculation: [
    { limit: 10, offset: 0, expectedPage: 1, scenario: 'first page' },
    { limit: 10, offset: 10, expectedPage: 2, scenario: 'second page' },
    { limit: 10, offset: 20, expectedPage: 3, scenario: 'third page' },
    { limit: 5, offset: 15, expectedPage: 4, scenario: 'page 4 with limit 5' },
    {
      limit: 20,
      offset: 100,
      expectedPage: 6,
      scenario: 'page 6 with limit 20',
    },
  ],
  offsetParsing: [
    { input: '0', expected: 0, scenario: 'valid zero offset' },
    { input: '10', expected: 10, scenario: 'valid positive offset' },
    { input: '100', expected: 100, scenario: 'valid large offset' },
    { input: '-5', expected: 0, scenario: 'negative offset defaults to 0' },
    { input: 'invalid', expected: 0, scenario: 'invalid string defaults to 0' },
    { input: undefined, expected: 0, scenario: 'undefined defaults to 0' },
  ],
  limitParsing: [
    { input: '10', expected: 10, scenario: 'valid limit' },
    { input: '50', expected: 50, scenario: 'valid higher limit' },
    { input: '101', expected: 100, scenario: 'limit over maximum' },
    { input: '0', expected: 1, scenario: 'zero limit' },
    { input: 'invalid', expected: 10, scenario: 'invalid string' },
    { input: undefined, expected: 10, scenario: 'undefined value' },
  ],
} as const;
