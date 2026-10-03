import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/drizzle/schema';
import * as relations from '@/drizzle/relations';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL as string,
    connectionTimeoutMillis: 60000,
  },
  schema: { ...schema, ...relations },
});
