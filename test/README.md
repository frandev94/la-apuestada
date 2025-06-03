# Test Organization

This document describes the test structure and organization for the La Apuestada project.

## 📁 Directory Structure

```
test/
├── setup.ts                    # Global test setup and configuration
├── api/                        # API endpoint tests
│   └── users.test.ts           # Users API endpoints
├── unit/                       # Unit tests for business logic
│   └── participants.test.ts    # Participants data validation
├── integration/                # Integration tests (future)
└── utils/                      # Test utilities and helpers
    ├── basic.test.ts           # Basic functionality tests
    └── test-helpers.ts         # Shared test utilities
```

## 🧪 Test Categories

### API Tests (`test/api/`)
Tests for Astro API routes and endpoints.
- **Purpose**: Validate HTTP request/response handling
- **Scope**: Individual API endpoints
- **Example**: Testing GET /api/users returns proper JSON structure

### Unit Tests (`test/unit/`)
Tests for individual functions, components, and modules.
- **Purpose**: Validate business logic in isolation
- **Scope**: Single functions or small modules
- **Example**: Testing participant data validation functions

### Integration Tests (`test/integration/`)
Tests for interactions between multiple components.
- **Purpose**: Validate component interactions
- **Scope**: Multiple modules working together
- **Example**: End-to-end user registration flow

### Utility Tests (`test/utils/`)
Basic functionality tests and test helpers.
- **Purpose**: Validate core utilities and provide test infrastructure
- **Scope**: Helper functions and basic operations

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
npm test test/api/          # API tests only
npm test test/unit/         # Unit tests only
npm test test/integration/  # Integration tests only

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
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

describe('Function Name', () => {
  test('should behave as expected', () => {
    const result = functionToTest(input);
    expect(result).toBe(expectedOutput);
  });
});
```

## 🎯 Best Practices

1. **Organize by purpose**: API, unit, integration, utils
2. **Use descriptive names**: Test what, not how
3. **Mock external dependencies**: Keep tests isolated
4. **Share common utilities**: Reuse test helpers
5. **Test both success and error cases**: Cover edge cases
6. **Keep tests focused**: One concept per test

## 📊 Coverage Goals

- **API endpoints**: 100% coverage
- **Business logic**: 90%+ coverage
- **Utilities**: 95%+ coverage
- **Integration**: Key user flows covered
