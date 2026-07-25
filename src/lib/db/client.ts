import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const url = process.env.TURSO_DATABASE_URL ?? 'file:./db/local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const tursoClient = createClient({ url, authToken });
export const db = drizzle(tursoClient, { schema });
export { schema };
