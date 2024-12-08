import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
  dbCredentials: {
    url: './db/sqlite.db',
  },
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
});
