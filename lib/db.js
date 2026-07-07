import { Pool } from 'pg';

let pool = null;

export function getPool() {
  if (!pool) {
    // Try pooling URL first, fallback to regular URL
    const connectionString = process.env.POSTGRES_URL_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No database connection string configured');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000,
      keepalives: 1,
      keepalives_idle: 30,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null;
    });
  }
  return pool;
}

export default getPool();
