import { defineConfig } from 'auth-astro';
import Discord from '@auth/core/providers/discord';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV ?? 'development';
const fileEnv = loadEnv(mode, process.cwd(), '');
// Vercel injects env vars into process.env at build/runtime; loadEnv only
// reads .env* files from disk. Fall back so prod builds on Vercel don't
// bake undefined credentials into the bundle.
const DISCORD_CLIENT_ID =
  fileEnv.DISCORD_CLIENT_ID ?? process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET =
  fileEnv.DISCORD_CLIENT_SECRET ?? process.env.DISCORD_CLIENT_SECRET;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
  throw new Error(
    'DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET must be set (via .env or Vercel env vars).',
  );
}

export default defineConfig({
  providers: [
    Discord({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
    }),
  ],
});
