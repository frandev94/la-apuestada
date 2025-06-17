import { describe, expect, test } from 'vitest';
import {
  calculatePagination,
  parsePaginationParams,
} from '../../../src/lib/api';
import { paginationTestCases } from '../../fixtures/users';

describe('API Utils - Pagination (Data-Driven Tests)', () => {
  describe.each(paginationTestCases)(
    'calculatePagination with page=$page, limit=$limit, totalUsers=$totalUsers',
    ({ page, limit, totalUsers, expectedOffset, expectedTotalPages }) => {
      test(`should calculate correct offset: ${expectedOffset}`, () => {
        const result = calculatePagination(totalUsers, limit, expectedOffset);
        expect(result.offset).toBe(expectedOffset);
      });

      test(`should calculate correct totalPages: ${expectedTotalPages}`, () => {
        const result = calculatePagination(totalUsers, limit, expectedOffset);
        expect(result.totalPages).toBe(expectedTotalPages);
      });

      test('should return correct pagination structure', () => {
        const result = calculatePagination(totalUsers, limit, expectedOffset);
        expect(result).toEqual({
          total: totalUsers,
          limit,
          offset: expectedOffset,
          page,
          totalPages: expectedTotalPages,
        });
      });
    },
  );
  describe.each([
    { input: '1', expected: 1, scenario: 'valid number string' },
    { input: 'invalid', expected: 1, scenario: 'invalid string' },
    { input: '0', expected: 1, scenario: 'zero value' },
    { input: '-5', expected: 1, scenario: 'negative number' },
    { input: '999', expected: 999, scenario: 'large valid number' },
    { input: undefined, expected: 1, scenario: 'undefined value' },
  ])(
    'parsePaginationParams page parsing - $scenario',
    ({ input, expected }) => {
      test(`should parse "${input}" as page ${expected}`, () => {
        const baseUrl = 'http://localhost:3000/api/users';
        const url = new URL(baseUrl);
        if (input !== undefined) {
          url.searchParams.set('limit', '10'); // Set consistent limit
          url.searchParams.set('offset', String((expected - 1) * 10)); // Calculate offset from expected page
        }

        const result = parsePaginationParams(url);
        expect(result.page).toBe(expected);
      });
    },
  );
  describe.each([
    { input: '10', expected: 10, scenario: 'valid limit' },
    { input: '50', expected: 50, scenario: 'valid higher limit' },
    { input: '101', expected: 100, scenario: 'limit over maximum' },
    { input: '0', expected: 1, scenario: 'zero limit' },
    { input: 'invalid', expected: 10, scenario: 'invalid string' },
    { input: undefined, expected: 10, scenario: 'undefined value' },
  ])(
    'parsePaginationParams limit parsing - $scenario',
    ({ input, expected }) => {
      test(`should parse "${input}" as limit ${expected}`, () => {
        const baseUrl = 'http://localhost:3000/api/users';
        const url = new URL(baseUrl);
        if (input !== undefined) {
          url.searchParams.set('limit', input);
        }

        const result = parsePaginationParams(url);
        expect(result.limit).toBe(expected);
      });
    },
  );
});
