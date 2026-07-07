import { Pool } from 'pg';

let pool = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export default getPool();
