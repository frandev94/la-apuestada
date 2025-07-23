import { defineConfig } from "auth-astro";
import Discord from '@auth/core/providers/discord';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

export default defineConfig({
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
});
