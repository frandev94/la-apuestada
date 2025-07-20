import { expect } from 'vitest';

/**
 * Custom Vitest matchers for API testing
 * Provides domain-specific assertions for better test readability
 */

interface CustomMatchers<R = unknown> {
  toBeSuccessfulApiResponse(): R;
  toBeErrorApiResponse(expectedCode?: string): R;
  toHavePaginationStructure(): R;
  toBeValidUser(): R;
  toBeValidUserList(): R;
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeSuccessfulApiResponse(received: unknown) {
    const pass: boolean =
      received !== null &&
      received !== undefined &&
      typeof received === 'object' &&
      'success' in received &&
      received.success === true &&
      'data' in received &&
      !('error' in received);

    return {
      pass,
      message: () =>
        pass
          ? 'Expected response not to be a successful API response'
          : `Expected response to be a successful API response with success: true and data property. Received: ${JSON.stringify(received, null, 2)}`,
    };
  },
  toBeErrorApiResponse(received: unknown, expectedCode?: string) {
    const isValidError =
      received !== null &&
      received !== undefined &&
      typeof received === 'object' &&
      'success' in received &&
      received.success === false &&
      'error' in received &&
      'message' in received &&
      !('data' in received);

    const hasCorrectCode = expectedCode
      ? typeof received === 'object' &&
        received !== null &&
        'error' in received &&
        received.error === expectedCode
      : true;

    const pass: boolean = isValidError && hasCorrectCode;

    const codeMessage = expectedCode ? ` with code "${expectedCode}"` : '';

    return {
      pass,
      message: () =>
        pass
          ? `Expected response not to be an error API response${codeMessage}`
          : `Expected response to be an error API response with success: false, error and message properties${codeMessage}. Received: ${JSON.stringify(received, null, 2)}`,
    };
  },

  toHavePaginationStructure(received: unknown) {
    const pass: boolean =
      received !== null &&
      received !== undefined &&
      typeof received === 'object' &&
      (('users' in received && Array.isArray(received.users)) ||
        ('items' in received && Array.isArray(received.items))) &&
      'pagination' in received &&
      typeof received.pagination === 'object' &&
      received.pagination !== null &&
      'page' in received.pagination &&
      typeof received.pagination.page === 'number' &&
      'limit' in received.pagination &&
      typeof received.pagination.limit === 'number' &&
      'total' in received.pagination &&
      typeof received.pagination.total === 'number' &&
      'totalPages' in received.pagination &&
      typeof received.pagination.totalPages === 'number';

    return {
      pass,
      message: () =>
        pass
          ? 'Expected object not to have pagination structure'
          : `Expected object to have pagination structure with users/items array and pagination object. Received: ${JSON.stringify(received, null, 2)}`,
    };
  },

  toBeValidUser(received: unknown) {
    const pass: boolean =
      received !== null &&
      received !== undefined &&
      typeof received === 'object' &&
      'id' in received &&
      typeof received.id === 'number' &&
      'name' in received &&
      typeof received.name === 'string' &&
      received.name.length > 0 &&
      'createdAt' in received &&
      'updatedAt' in received &&
      !('hashed_password' in received) && // Should not expose password
      !('password' in received);

    return {
      pass,
      message: () =>
        pass
          ? 'Expected object not to be a valid user'
          : `Expected object to be a valid user with id, name, createdAt, updatedAt (without password fields). Received: ${JSON.stringify(received, null, 2)}`,
    };
  },

  toBeValidUserList(received: unknown) {
    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () => `Expected an array, received: ${typeof received}`,
      };
    }

    const allValid = received.every((user) => {
      return (
        user !== null &&
        user !== undefined &&
        typeof user === 'object' &&
        'id' in user &&
        typeof user.id === 'number' &&
        'name' in user &&
        typeof user.name === 'string' &&
        user.name.length > 0 &&
        'createdAt' in user &&
        'updatedAt' in user &&
        !('hashed_password' in user) &&
        !('password' in user)
      );
    });

    return {
      pass: allValid,
      message: () =>
        allValid
          ? 'Expected array not to contain all valid users'
          : `Expected array to contain only valid users. Received: ${JSON.stringify(received, null, 2)}`,
    };
  },
});
