// src/db/index.ts
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'; // <- важно

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
// или (в некоторых пропусках API) — drizzle(process.env.DATABASE_URL)
export type Database = typeof db;
