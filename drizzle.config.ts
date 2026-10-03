import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: './drizzle',
  schema: './drizzle/schema.ts',
  extensionsFilters: ['postgis'],
  tablesFilter: ['*'],
});
