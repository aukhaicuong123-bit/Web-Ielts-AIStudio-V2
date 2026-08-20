import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

if (!process.env.PGHOST || !process.env.PGPORT || !process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD) {
  throw new Error('PostgreSQL environment variables are not fully configured');
}

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (error) => {
  console.error('[DB] Unexpected PostgreSQL pool error:', error);
});