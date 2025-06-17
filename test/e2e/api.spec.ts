import { expect, test } from '@playwright/test';

test.describe('API Endpoints E2E', () => {
  test('GET /api/users returns users list', async ({ request }) => {
    const response = await request.get('/api/users');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('users');
    expect(data.data).toHaveProperty('pagination');
    expect(Array.isArray(data.data.users)).toBe(true);
  });

  test('GET /api returns API info', async ({ request }) => {
    const response = await request.get('/api');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('message');
    expect(data.data).toHaveProperty('endpoints');
    expect(Array.isArray(data.data.endpoints)).toBe(true);
  });
});
