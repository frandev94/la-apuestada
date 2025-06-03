import { User, db } from 'astro:db';
import { loadEnv } from 'vite';
import { createHash } from '../src/utils/auth.js';

const { DEFAULT_USER_PASSWORD } = loadEnv(
  process.env.NODE_ENV ?? '',
  process.cwd(),
  '',
);

// https://astro.build/db/seed
export default async function seed() {
  if (!DEFAULT_USER_PASSWORD) {
    console.warn('No DEFAULT_USER_PASSWORD set, skipping user creation.');
    return;
  }

  await db.insert(User).values([
    {
      name: 'Wargios',
      hashed_password: createHash(DEFAULT_USER_PASSWORD),
    },
    {
      name: 'Gonpar',
      hashed_password: createHash(DEFAULT_USER_PASSWORD),
    },
  ]);
}
