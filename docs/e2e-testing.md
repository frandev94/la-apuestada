# E2E Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Playwright provides reliable, fast cross-browser testing capabilities.

## What's Installed

Following the [Playwright documentation](https://playwright.dev/docs/intro#whats-installed), the following has been set up:

### 1. **@playwright/test package** 
Installed as a dev dependency for writing and running tests.

### 2. **playwright.config.ts**
Configuration file with:
- Test directory set to `./test/e2e`
- Base URL configured for Astro dev server (`http://localhost:4321`)
- Cross-browser testing (Chromium, Firefox, WebKit)
- Automatic dev server startup before tests
- Trace collection on first retry for debugging

### 3. **Test Files**
- `test/e2e/api.spec.ts` - Focused API endpoint integration tests

### 4. **Browser Binaries**
Downloaded browsers for testing:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)  
- WebKit (Desktop Safari)

### 5. **GitHub Actions Workflow**
CI/CD pipeline in `.github/workflows/playwright.yml` for automated testing.

## Running E2E Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Generate tests with Codegen
npm run test:e2e:codegen

# Show last test report
npx playwright show-report
```

## Test Structure

### Homepage Tests (`example.spec.ts`)
- ✅ Page title verification
- ✅ Welcome content visibility
- ✅ Navigation links functionality
- ✅ Astro 5.0 news section

### API Tests (`api.spec.ts`)
- ✅ Users list endpoint (`GET /api/users`)
- ✅ Pagination functionality
- ✅ Name filtering
- ✅ Individual user lookup (`GET /api/users/[id]`)
- ✅ Error handling (404, 400 responses)
- ✅ API index endpoint (`GET /api`)

## Cross-Browser Testing

Tests run automatically on:
- **Chromium** (Chrome/Edge)
- **Firefox** 
- **WebKit** (Safari)

## Configuration Features

- **Auto-retry**: Tests retry once on failure in CI
- **Parallel execution**: Tests run in parallel for speed
- **Trace collection**: Debugging info collected on failures
- **Dev server integration**: Automatically starts Astro dev server
- **CI optimization**: Configured for GitHub Actions

## Writing New Tests

Create new `.spec.ts` files in `test/e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Expected Title/);
});
```

For API testing:

```typescript
test('api test', async ({ request }) => {
  const response = await request.get('/api/endpoint');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
});
```

## Reports and Debugging

- HTML reports generated after test runs
- Trace viewer for debugging failed tests
- Screenshots and videos captured on failures
- Interactive UI mode for test development

For more information, visit the [Playwright documentation](https://playwright.dev/docs/intro).
