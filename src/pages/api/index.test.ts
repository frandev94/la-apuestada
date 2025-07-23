import { describe, expect, test } from 'vitest';
import { createMockAPIContext } from '../../__tests__/utils/test-helpers';
import { GET } from './index.ts';

describe('API Index Endpoint', () => {
  test('should return API info and available endpoints', async () => {
    const request = new Request('http://localhost/api');
    const context = createMockAPIContext(request);

    const response = await GET(context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('message');
    expect(data.data).toHaveProperty('endpoints');
    expect(Array.isArray(data.data.endpoints)).toBe(true);
    expect(data.data.endpoints.length).toBeGreaterThan(0);
  });
});
