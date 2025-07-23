import { describe, expect, test } from 'vitest';
import { paginationTestCases } from '../__tests__/fixtures/users';
import { calculatePagination, parsePaginationParams } from './api';

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

      test(`should calculate correct page: ${page}`, () => {
        const result = calculatePagination(totalUsers, limit, expectedOffset);
        const expectedCalculatedPage = Math.floor(expectedOffset / limit) + 1;
        expect(result.page).toBe(expectedCalculatedPage);
      });

      test('should return correct pagination structure', () => {
        const result = calculatePagination(totalUsers, limit, expectedOffset);
        const expectedCalculatedPage = Math.floor(expectedOffset / limit) + 1;
        expect(result).toEqual({
          total: totalUsers,
          limit,
          offset: expectedOffset,
          page: expectedCalculatedPage,
          totalPages: expectedTotalPages,
        });
      });
    },
  );
  describe.each([
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
  ])(
    'parsePaginationParams page calculation - $scenario',
    ({ limit, offset, expectedPage }) => {
      test(`should calculate page ${expectedPage} from limit=${limit} and offset=${offset}`, () => {
        const baseUrl = 'http://localhost:3000/api/users';
        const url = new URL(baseUrl);
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('offset', String(offset));

        const result = parsePaginationParams(url);
        expect(result.page).toBe(expectedPage);
        expect(result.limit).toBe(limit);
        expect(result.offset).toBe(offset);
      });
    },
  );
  describe.each([
    { input: '0', expected: 0, scenario: 'valid zero offset' },
    { input: '10', expected: 10, scenario: 'valid positive offset' },
    { input: '100', expected: 100, scenario: 'valid large offset' },
    { input: '-5', expected: 0, scenario: 'negative offset defaults to 0' },
    { input: 'invalid', expected: 0, scenario: 'invalid string defaults to 0' },
    { input: undefined, expected: 0, scenario: 'undefined defaults to 0' },
  ])(
    'parsePaginationParams offset parsing - $scenario',
    ({ input, expected }) => {
      test(`should parse "${input}" as offset ${expected}`, () => {
        const baseUrl = 'http://localhost:3000/api/users';
        const url = new URL(baseUrl);
        if (input !== undefined) {
          url.searchParams.set('offset', input);
        }

        const result = parsePaginationParams(url);
        expect(result.offset).toBe(expected);
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
