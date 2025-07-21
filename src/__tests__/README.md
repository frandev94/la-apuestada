# Test Organization

This document describes the test structure and organization for the La Apuestada project.

## 🚀 Quick Start

- **Run all tests**: `npm test` (runs unit/API tests)
- **Run only unit tests**: `npm run test:unit`
- **Run only API tests**: `npm run test:api`
- **Run with coverage**: `npm run test:coverage`

## 📁 Directory Structure

```text
src/__tests__/
├── setup.ts                    # Global test setup and configuration
├── fixtures/                   # 🆕 Centralized test data management
│   ├── *.ts                    # Domain-specific test fixtures
│   └── ...                     # Additional fixture files as needed
└── utils/                      # Test utilities and helpers
    ├── custom-matchers.ts      # 🆕 Domain-specific test matchers
    └── test-helpers.ts         # Shared test utilities

src/                            # Test files co-located with source code
├── components/
│   ├── *.test.tsx              # Component tests
│   └── **/                     # Nested component tests
│       └── *.test.tsx          
├── constants/
│   └── *.test.ts               # Constants/data layer tests
├── lib/
│   └── *.test.ts               # Library function tests
└── pages/api/
    └── **/*.test.ts            # API endpoint tests (any depth)
```

## 🆕 New Testing Features

### Test Fixtures (`src/__tests__/fixtures/`)

Centralized test data management for consistent and maintainable tests:

- **API fixtures**: HTTP status codes, endpoint definitions, and response templates
- **Component fixtures**: Mock data for UI components and user interactions
- **Data fixtures**: Test data for business entities and domain models
- **Utility fixtures**: Common test scenarios and edge cases

**Usage Example:**

```typescript
import {
  mockData,
  testScenarios,
  validationCases,
} from "../../__tests__/fixtures/[domain]";

test("should handle valid input", () => {
  const result = functionUnderTest(mockData.valid);
  expect(result).toBeDefined();
});
```

### Custom Matchers (`src/__tests__/utils/custom-matchers.ts`)

Domain-specific assertions for improved test readability:

- **`.toBeSuccessfulApiResponse()`**: Validates successful API response structure
- **`.toBeErrorApiResponse(code?)`**: Validates error API response with optional error code
- **`.toHavePaginationStructure()`**: Validates pagination response structure
- **`.toBeValidUser()`**: Validates user object structure (without sensitive fields)
- **`.toBeValidUserList()`**: Validates array of user objects

**Usage Example:**

```typescript
expect(response).toBeSuccessfulApiResponse();
expect(errorResponse).toBeErrorApiResponse("VALIDATION_ERROR");
expect(data).toHavePaginationStructure();
expect(user).toBeValidUser();
```

### Data-Driven Tests with `describe.each`

Parametrized testing for comprehensive coverage with minimal code duplication:

```typescript
describe.each(testScenarios)(
  "functionality with $scenario",
  ({ input, expected, description }) => {
    test(`should ${description}`, () => {
      const result = functionUnderTest(input);
      expect(result).toBe(expected);
    });
  },
);
```

## 🧪 Test Categories

### API Tests (co-located with `src/pages/api/`)

Tests for Astro API routes and endpoints that are co-located with their source files.

- **Purpose**: Validate HTTP request/response handling, status codes, and JSON responses
- **Scope**: Individual API endpoints and route handlers
- **Structure**: Test files are placed alongside their corresponding API files
- **🆕 Enhanced**: Now uses custom matchers for cleaner assertions

### Unit Tests (co-located with source files)

Tests for individual functions, components, and utility modules that are co-located with their source files.

- **Purpose**: Validate business logic, utilities, and helper functions in isolation
- **Scope**: Single functions, classes, or small modules
- **Structure**: Test files are placed alongside their corresponding source files
- **🆕 Enhanced**: Includes data-driven tests and fixture-based testing

## 🗂️ File Organization Principles

1. **Co-located testing**: Test files are placed alongside their corresponding source files
2. **Clear naming**: Test files use `.test.ts` or `.test.tsx` extensions
3. **Centralized utilities**: Test fixtures and utilities are centralized in `src/__tests__/`
4. **Easy navigation**: Finding tests for a specific source file is intuitive

### Finding Tests for Source Files

| Source File Pattern            | Test Location Pattern                     |
| ------------------------------- | ------------------------------------------ |
| `src/lib/*.ts`                  | `src/lib/*.test.ts`                        |
| `src/constants/*.ts`            | `src/constants/*.test.ts`                  |
| `src/pages/api/**/*.ts`         | `src/pages/api/**/*.test.ts`               |
| `src/components/*.tsx`          | `src/components/*.test.tsx`                |

## 🛠️ Test Utilities

### `src/__tests__/utils/test-helpers.ts`

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
test("should handle database errors", async () => {
  mockDb.from.mockRejectedValue(new Error("Database error"));

  const response = await withSuppressedConsole(async () => {
    return await getUsersHandler(context);
  });

  expect(response.status).toBe(500);
});

// Or use the suppressConsole utility for more control
test("with manual control", () => {
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

# Run specific test files
npx vitest run src/lib/           # All library tests
npx vitest run src/components/    # All component tests
npx vitest run **/*.test.ts       # All test files matching pattern
```

## 📝 Writing Tests

### API Tests Example

```typescript
import { describe, expect, test, beforeEach, vi } from "vitest";
import { createMockAPIContext } from "../../__tests__/utils/test-helpers.js";

// Mock external dependencies
vi.mock("astro:db", () => ({
  /* mock implementation */
}));

describe("API Endpoint", () => {
  test("should handle request correctly", async () => {
    const request = new Request("http://localhost/api/endpoint");
    const context = createMockAPIContext(request);

    // Test implementation
  });
});
```

### Unit Tests Example

```typescript
import { describe, expect, test } from "vitest";
import { functionToTest } from "./module.js"; // Co-located with test

describe("Module Name", () => {
  test("should handle valid input correctly", () => {
    const result = functionToTest(validInput);
    expect(result).toBe(expectedOutput);
  });

  test("should handle edge cases", () => {
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
