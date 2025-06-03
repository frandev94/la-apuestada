# Test Organization

This document describes the test structure and organization for the La Apuestada project.

## 📁 Directory Structure

```
test/
├── setup.ts                    # Global test setup and configuration
├── api/                        # API endpoint tests
│   └── *.test.ts               # Tests for API routes and endpoints
├── unit/                       # Unit tests for business logic and utilities
│   └── *.test.ts               # Tests for individual functions and modules
├── integration/                # Integration tests
│   └── *.test.ts               # Tests for component interactions
└── utils/                      # Test utilities and helpers
    ├── *.test.ts               # Basic functionality tests
    ├── test-helpers.ts         # Shared test utilities
    └── *.md                    # Documentation files
```

## 🧪 Test Categories

### API Tests (`test/api/`)
Tests for Astro API routes and endpoints.
- **Purpose**: Validate HTTP request/response handling, status codes, and JSON responses
- **Scope**: Individual API endpoints and route handlers
- **Examples**: 
  - GET/POST/PUT/DELETE endpoint behavior
  - Request parameter validation
  - Response format consistency
  - Error handling and status codes

### Unit Tests (`test/unit/`)
Tests for individual functions, components, and utility modules.
- **Purpose**: Validate business logic, utilities, and helper functions in isolation
- **Scope**: Single functions, classes, or small modules
- **Examples**: 
  - Data validation functions
  - Utility functions (auth, formatting, calculations)
  - Component logic
  - Pure business logic

### Integration Tests (`test/integration/`)
Tests for interactions between multiple components or systems.
- **Purpose**: Validate component interactions and workflow integration
- **Scope**: Multiple modules working together, database interactions, external services
- **Examples**: 
  - End-to-end user workflows
  - Database operations with business logic
  - API integration with data layer
  - Complex feature interactions

### Utility Tests (`test/utils/`)
Infrastructure tests and test helper validation.
- **Purpose**: Validate test infrastructure and provide testing utilities
- **Scope**: Test helpers, mock factories, and basic functionality validation
- **Examples**:
  - Test helper function validation
  - Mock data generation
  - Basic mathematical operations
  - Development environment setup

## 🛠️ Test Utilities

### `test-helpers.ts`
Provides common utilities for testing:

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
  const consoleSuppressor = suppressConsole();
  
  // Test code that logs to console
  
  consoleSuppressor.restore();
});
```

This ensures test output remains clean while still testing error handling properly.

### TypeScript Types
For enhanced type safety and better developer experience, see [TYPED_MOCKS.md](./TYPED_MOCKS.md) for detailed information about using TypeScript types with mocks.

## 🏃‍♂️ Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:api           # API tests only
npm run test:unit          # Unit tests only  
npm run test:integration   # Integration tests only
npm run test:utils         # Utility tests only

# Run tests by pattern
npm test -- test/api/      # All API tests
npm test -- test/unit/     # All unit tests
npm test -- "**/*auth*"    # All auth-related tests
npm test -- users          # All tests containing "users"

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test file
npm test -- auth.test.ts
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
import { functionToTest } from '../../src/utils/module.js';

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

### Integration Tests Example
```typescript
import { describe, expect, test } from 'vitest';
import { performComplexOperation } from '../../src/services/index.js';

describe('Complex Operation Flow', () => {
  test('should complete end-to-end workflow', async () => {
    const result = await performComplexOperation(testData);
    expect(result.status).toBe('completed');
    expect(result.data).toMatchObject(expectedStructure);
  });
});
```

## 🎯 Best Practices

1. **Organize by purpose**: API, unit, integration, utils - each serves a specific testing need
2. **Use descriptive names**: Test descriptions should explain the expected behavior
3. **Mock external dependencies**: Keep tests isolated and predictable
4. **Share common utilities**: Reuse test helpers and mock data across test files
5. **Test both success and error cases**: Cover happy paths and edge cases
6. **Keep tests focused**: One concept or behavior per test
7. **Use meaningful assertions**: Test the right things, not just that code runs
8. **Follow naming conventions**: 
   - `*.test.ts` for all test files
   - Descriptive test and describe block names
   - Group related tests logically

## 📊 Coverage Goals

- **API endpoints**: 100% coverage for request/response handling
- **Business logic & utilities**: 90%+ coverage for core functionality  
- **Integration workflows**: Key user journeys and data flows covered
- **Error handling**: All error paths and edge cases tested

## 🔄 Test Maintenance

- **Review test coverage regularly**: Use `npm run test:coverage` to identify gaps
- **Update tests when adding features**: New functionality should include corresponding tests
- **Refactor tests when refactoring code**: Keep tests in sync with implementation
- **Remove obsolete tests**: Clean up tests for removed features
- **Document complex test scenarios**: Add comments for non-obvious test logic
