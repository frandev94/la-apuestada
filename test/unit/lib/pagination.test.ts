import { describe, expect, test } from 'vitest';
import {
  calculatePagination,
  parsePaginationParams,
} from '../../../src/lib/api';
import {
  paginationTestCases,
  parsePaginationTestCases,
} from '../../fixtures/pagination';

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
        expect(result.page).toBe(page);
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
  describe.each(parsePaginationTestCases.pageCalculation)(
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
  describe.each(parsePaginationTestCases.offsetParsing)(
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
  describe.each(parsePaginationTestCases.limitParsing)(
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
