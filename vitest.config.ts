/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'jsdom',
    include: [
      'test/**/*.test.ts'
    ],
    exclude: [
      'test/e2e/**/*'
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/index.ts',
        'src/**/types.ts',
        'test/**/*',
      ],
    },
    globals: true,
    // Test organization
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
