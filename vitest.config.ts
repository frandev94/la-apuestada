/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import type { InlineConfig } from 'vitest/node';

// Extend Astro's UserConfig to include Vitest's test property
declare module 'astro/config' {
  interface UserConfig {
    test?: InlineConfig;
  }
}

export default getViteConfig({
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}'
    ],
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
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
} as any); // Type assertion to bypass TypeScript issues
