# Test Organization

This document describes the test structure and organization for the La Apuestada project.

## 🚀 Quick Start

- **Run all tests**: `npm test` (runs unit/API tests)
- **Run only unit tests**: `npm run test:unit`
- **Run only API tests**: `npm run test:api`
- **Run with coverage**: `npm run test:coverage`

## 📁 Directory Structure

```text
test/
├── setup.ts                    # Global test setup and configuration
├── fixtures/                   # 🆕 Centralized test data management
│   ├── users.ts                # User-related test fixtures and data
│   └── api.ts                  # API endpoint test fixtures
├── api/                        # API endpoint tests (mirrors src/pages/api/)
│   └── *.test.ts               # Tests for API endpoints
├── unit/                       # Unit tests (mirrors src/ structure)
│   ├── data/                   # Tests for src/data/ modules
│   │   └── *.test.ts           # Data layer tests
│   └── lib/                    # Tests for src/lib/ modules
│       └── *.test.ts           # Library function tests
└── utils/                      # Test utilities and helpers
    ├── test-helpers.ts         # Shared test utilities
    └── custom-matchers.ts      # 🆕 Domain-specific test matchers
```

## 🆕 New Testing Features

### Test Fixtures (`test/fixtures/`)

Centralized test data management for consistent and maintainable tests:

- **`users.ts`**: User-related test data, including valid/invalid scenarios and pagination test cases
- **`api.ts`**: API endpoint information and common HTTP status codes

**Usage Example:**

```typescript
import { validUserData, mockUserRecords, paginationTestCases } from '../fixtures/users';

test('should create user with valid data', () => {
  const result = createUser(validUserData);
  expect(result).toBeDefined();
});
```

### Custom Matchers (`test/utils/custom-matchers.ts`)

Domain-specific assertions for improved test readability:

- **`.toBeSuccessfulApiResponse()`**: Validates successful API response structure
- **`.toBeErrorApiResponse(code?)`**: Validates error API response with optional error code
- **`.toHavePaginationStructure()`**: Validates pagination response structure
- **`.toBeValidUser()`**: Validates user object structure (without sensitive fields)
- **`.toBeValidUserList()`**: Validates array of user objects

**Usage Example:**

```typescript
expect(response).toBeSuccessfulApiResponse();
expect(errorResponse).toBeErrorApiResponse('VALIDATION_ERROR');
expect(data).toHavePaginationStructure();
expect(user).toBeValidUser();
```

### Data-Driven Tests with `describe.each`

Parametrized testing for comprehensive coverage with minimal code duplication:

```typescript
describe.each(paginationTestCases)(
  'calculatePagination with page=$page, limit=$limit, totalUsers=$totalUsers',
  ({ page, limit, totalUsers, expectedOffset, expectedTotalPages }) => {
    test(`should calculate correct offset: ${expectedOffset}`, () => {
      const result = calculatePagination(page, limit, totalUsers);
      expect(result.offset).toBe(expectedOffset);
    });
  }
);
```

## 🧪 Test Categories

### API Tests (`test/api/`)

Tests for Astro API routes and endpoints that mirror the `src/pages/api/` structure.
- **Purpose**: Validate HTTP request/response handling, status codes, and JSON responses
- **Scope**: Individual API endpoints and route handlers
- **Structure**: Mirrors `src/pages/api/` directory structure
- **🆕 Enhanced**: Now uses custom matchers for cleaner assertions

### Unit Tests (`test/unit/`)

Tests for individual functions, components, and utility modules that mirror the `src/` structure.

- **Purpose**: Validate business logic, utilities, and helper functions in isolation
- **Scope**: Single functions, classes, or small modules
- **Structure**: Mirrors `src/` directory structure (`lib/`, `data/`, etc.)
- **🆕 Enhanced**: Includes data-driven tests and fixture-based testing

## 🗂️ File Organization Principles

1. **Mirror source structure**: Test directories mirror the `src/` structure
2. **Clear separation**: API tests and unit tests are clearly separated
3. **Logical grouping**: Related tests are grouped in the same directory
4. **Easy navigation**: Finding tests for a specific source file is intuitive

### Finding Tests for Source Files

| Source File | Test Location |
|-------------|---------------|
| `src/lib/auth.ts` | `test/unit/lib/auth.test.ts` |
| `src/lib/api.ts` | `test/unit/lib/api.test.ts` |
| `src/data/participants.ts` | `test/unit/data/participants.test.ts` |
| `src/pages/api/users/index.ts` | `test/api/users.test.ts` |
| `src/pages/api/index.ts` | `test/api/index.test.ts` |

## 🛠️ Test Utilities

### `test/utils/test-helpers.ts`

Provides common utilities for testing across all test categories:

- **`createMockAPIContext()`**: Creates mock Astro API context
- **`createMockDatabase()`**: Factory for mocking astro:db
- **`suppressConsole()`**: Temporarily suppress console output during tests
- **`withSuppressedConsole()`**: Wrapper to run tests with suppressed console output
- **Mock data**: `mockUsers`, `mockSafeUsers` for consistent test data
- **HTTP helpers**: `createMockResponse()`, `expectAPIResponse()` for response testing

## 🔇 Console Output Management

For tests that intentionally trigger errors (like database error scenarios), you can suppress console output to keep test results clean.

### Manual Suppression for Error Testing

Use the `withSuppressedConsole()` utility when testing error scenarios:

```typescript
// Suppress console output for a specific test that triggers known errors
test('should handle database errors', async () => {
  mockDb.from.mockRejectedValue(new Error('Database error'));
  
  const response = await withSuppressedConsole(async () => {
    return await getUsersHandler(context);
  });
  
  expect(response.status).toBe(500);
});

// Or use the suppressConsole utility for more control
test('with manual control', () => {
  const consoleSuppressor = suppressConsole();
  
  try {
    // Code that would log errors
    someOperation();
  } finally {
    consoleSuppressor.restore();
  }
});
```

This approach keeps console output clean during error testing while preserving normal logging for debugging.

### TypeScript Types

For enhanced type safety and better developer experience, all test utilities include proper TypeScript types for better autocomplete and error detection.

## 🏃‍♂️ Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:api           # API tests only
npm run test:unit          # Unit tests only  

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run tests with UI
npm run test:ui            # Vitest UI

# Run specific test file
npx vitest run test/unit/lib/auth.test.ts     # Specific unit test
npx vitest run test/api/users.test.ts         # Specific API test
npx vitest run auth.test.ts                   # Run any test matching pattern
```

## 📝 Writing Tests

### API Tests Example

```typescript
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { createMockAPIContext } from '../utils/test-helpers.js';

// Mock external dependencies
vi.mock('astro:db', () => ({ /* mock implementation */ }));

describe('API Endpoint', () => {
  test('should handle request correctly', async () => {
    const request = new Request('http://localhost/api/test');
    const context = createMockAPIContext(request);
    
    // Test implementation
  });
});
```

### Unit Tests Example

```typescript
import { describe, expect, test } from 'vitest';
import { functionToTest } from '../../../src/lib/module.js';

describe('Module Name', () => {
  test('should handle valid input correctly', () => {
    const result = functionToTest(validInput);
    expect(result).toBe(expectedOutput);
  });
  
  test('should handle edge cases', () => {
    expect(() => functionToTest(invalidInput)).toThrow();
  });
});
```

## 🎯 Best Practices

1. **Follow source structure**: Test organization mirrors source code organization
2. **Use descriptive names**: Test descriptions should explain the expected behavior
3. **Mock external dependencies**: Keep tests isolated and predictable
4. **Share common utilities**: Reuse test helpers and mock data across test files
5. **Test both success and error cases**: Cover happy paths and edge cases
6. **Keep tests focused**: One concept or behavior per test
7. **Use meaningful assertions**: Test the right things, not just that code runs
8. **Follow naming conventions**: 
   - `*.test.ts` for unit and API tests
   - Descriptive test and describe block names
   - Group related tests logically
9. **Organize by source structure**: Easy to find tests for any source file

## 📊 Coverage Goals

- **API endpoints**: 100% coverage for request/response handling
- **Business logic & utilities**: 90%+ coverage for core functionality  
- **Error handling**: All error paths and edge cases tested

## 🔄 Test Maintenance

- **Review test coverage regularly**: Use `npm run test:coverage` to identify gaps
- **Update tests when adding features**: New functionality should include corresponding tests
- **Refactor tests when refactoring code**: Keep tests in sync with implementation
- **Remove obsolete tests**: Clean up tests for removed features
- **Document complex test scenarios**: Add comments for non-obvious test logic
- **Maintain directory structure**: Keep test structure aligned with source structure
