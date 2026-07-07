import { Pool } from 'pg';

let pool = null;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No database connection string configured');
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000,
      keepalives: 1,
      keepalives_idle: 30,
      family: 4,
    });

    pool.on('error', (err) => {
      console.error('Database error:', err);
      pool = null;
    });
  }
  return pool;
}

// Export only the function, NOT called!
export default getPool;
