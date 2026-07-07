import { Pool } from 'pg';
import { parse as parseUrl } from 'url';

let pool;

const getPool = () => {
  if (pool) return pool;

  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  const url = parseUrl(connectionString);
  const auth = url.auth?.split(':') || [];

  const config = {
    user: auth[0] || process.env.PGUSER,
    password: auth[1] || process.env.PGPASSWORD,
    host: url.hostname || process.env.PGHOST,
    port: parseInt(url.port || process.env.PGPORT || '5432'),
    database: url.pathname?.substring(1) || process.env.PGDATABASE || 'neondb',
    ssl: { rejectUnauthorized: false },
    family: 4,
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
    application_name: 'rentfast',
  };

  pool = new Pool(config);
  return pool;
};

export default getPool();
