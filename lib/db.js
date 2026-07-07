import { Pool } from 'pg';

let pool = null;

export function getPool() {
  if (!pool) {
    // Build connection from individual variables to avoid IPv6 resolution issues
    const poolConfig = {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE || 'neondb',
      user: process.env.PGUSER || 'neondb_owner',
      password: process.env.PGPASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000,
      keepalives: 1,
      keepalives_idle: 30,
      ssl: { rejectUnauthorized: false },
      family: 4, // Force IPv4
    };

    pool = new Pool(poolConfig);

    pool.on('error', (err) => {
      console.error('Database connection error:', err.message);
      pool = null;
    });
  }
  return pool;
}

export default getPool;
