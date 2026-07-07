import { Pool } from 'pg';

let pool = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      max: 1,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000,
      application_name: 'rentfast',
      ssl: false,
    });

    pool.on('error', (err) => {
      console.error('Pool error:', err);
    });
  }
  return pool;
}

export default getPool;
