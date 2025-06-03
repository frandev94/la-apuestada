# TypeScript Types with Mocks in Vitest

This document explains how we've enhanced our test suite with TypeScript types for better type safety, autocomplete, and maintainability.

## 🎯 Benefits of Typed Mocks

### 1. **Type Safety**
- Catch type errors at compile time instead of runtime
- Ensure mock responses match expected API contracts
- Prevent incorrect property access on mock objects

### 2. **Better Developer Experience**
- IntelliSense/autocomplete for mock objects
- Clear function signatures and return types
- Documentation through types

### 3. **Maintainability**
- Refactoring becomes safer with type checking
- Interface changes are caught immediately
- Self-documenting test code

## 🏗️ Implementation

### Type Definitions (`test-helpers.ts`)

```typescript
// User data types
export interface MockUser {
  id: number;
  name: string;
  hashed_password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockSafeUser {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mock database types
export interface MockDatabase {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  // ... other methods
}
```

### Typed Helper Functions

```typescript
// Typed mock creation
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => {
  return {
    id: 1,
    name: 'Test User',
    hashed_password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

// Typed API context
export const createMockAPIContext = (
  request: Request, 
  params: Record<string, string> = {}
): APIContext => {
  // ... implementation
};

// Type-safe response assertions
export const expectAPIResponse = <T = any>(
  response: APIResponse<T>, 
  success = true
): void => {
  expect(response).toHaveProperty('success', success);
  if (success) {
    expect(response).toHaveProperty('data');
  } else {
    expect(response).toHaveProperty('error');
  }
};
```

## 🧪 Usage Examples

### 1. Typed Mock Functions

```typescript
// Before: No type safety
const mockService = vi.fn();
mockService.mockResolvedValue(anything); // Could be wrong type

// After: With types
const mockService = vi.fn<(id: number) => Promise<MockUser>>();
mockService.mockResolvedValue(user); // Type-checked
```

### 2. Typed API Responses

```typescript
// Before: Any type
const response = await apiHandler(context);
const data = await response.json(); // data is 'any'

// After: With types
const response = await apiHandler(context);
const data: APIResponse<{ user: MockUser }> = await response.json();
// TypeScript knows the structure of data
```

### 3. Typed Mock Data

```typescript
// Before: Plain objects
const user = { id: 1, name: 'John' }; // Missing properties

// After: With types
const user = createMockUser({ id: 1, name: 'John' });
// All required properties are included with defaults
```

## 🔧 Best Practices

### 1. **Use Interface Definitions**
Define clear interfaces for your domain objects:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
```

### 2. **Type Mock Functions**
Always type your mock functions with expected signatures:

```typescript
const mockUserRepository = vi.fn<(id: number) => Promise<User>>();
```

### 3. **Use Generic Types for Responses**
Make response types reusable with generics:

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 4. **Create Typed Factories**
Build helper functions for creating test data:

```typescript
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  ...overrides,
});
```

### 5. **Use Type Guards in Tests**
Implement type safety in conditional logic:

```typescript
if (response.success) {
  // TypeScript knows response.data exists here
  expect(response.data.user).toBeDefined();
} else {
  // TypeScript knows response.error exists here
  expect(response.error).toBeDefined();
}
```

## 📊 Type Safety Benefits in Our Test Suite

### Before Types
```typescript
// Potential runtime errors
const user = { id: '1' }; // Wrong type
const response = await handler(context);
const data = await response.json();
data.user.name; // Could be undefined
```

### After Types
```typescript
// Compile-time safety
const user = createMockUser({ id: 1 }); // Correct type
const response = await handler(context);
const data: APIResponse<{ user: MockUser }> = await response.json();
data.data?.user.name; // Safe access with optional chaining
```

## 🚀 Advanced Patterns

### Conditional Types for Responses
```typescript
type APIResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; message?: string };
```

### Mock Type Utilities
```typescript
type MockedFunction<T> = T extends (...args: infer A) => infer R
  ? ReturnType<typeof vi.fn> & ((...args: A) => R)
  : never;
```

### Testing Error Cases
```typescript
test('should handle typed error responses', async () => {
  const errorResponse: APIResponse = {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Invalid input data'
  };
  
  // Type-safe error handling
  expect(errorResponse.success).toBe(false);
  if (!errorResponse.success) {
    expect(errorResponse.error).toBe('VALIDATION_ERROR');
  }
});
```

## 📝 Migration Strategy

1. **Start with interfaces**: Define types for your domain objects
2. **Type existing mocks**: Add types to current mock functions
3. **Create typed helpers**: Build utility functions for common patterns
4. **Gradually refactor**: Update tests one file at a time
5. **Enable strict mode**: Use strict TypeScript settings for maximum safety

## 🔇 Console Management in Tests

When testing error scenarios, console output can clutter test results. Our test utilities provide clean console management:

### Automatic Suppression
The test setup automatically suppresses known error messages:
```typescript
// In setup.ts - automatically handles known database errors
console.error = vi.fn((message, ...args) => {
  if (message.includes('Error fetching users:')) {
    return; // Silent for known test errors
  }
  // Log other errors normally
});
```

### Manual Console Control
```typescript
// Suppress console for specific tests
test('should handle errors silently', async () => {
  const response = await withSuppressedConsole(async () => {
    return await handlerThatLogs();
  });
  
  expect(response.status).toBe(500);
});

// Or use fine-grained control
test('with detailed control', () => {
  const consoleSuppressor = suppressConsole();
  
  // Test code that would log
  someOperationThatLogs();
  
  // Check what was logged (if needed)
  const errorCalls = consoleSuppressor.getErrorCalls();
  expect(errorCalls).toHaveLength(1);
  
  consoleSuppressor.restore();
});
```

This approach keeps test output clean while maintaining full error testing capabilities.

By implementing typed mocks, we've significantly improved our test suite's reliability, maintainability, and developer experience while catching potential issues at compile time rather than runtime.
