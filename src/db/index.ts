import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema'

const client = new Database('./db/sqlite.db');
const db = drizzle({ client, schema });

export { db };