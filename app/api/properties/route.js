import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../../lib/db';
import { authenticateToken } from '../../../lib/auth';
export async function GET(request) {
  try {
    const auth = authenticateToken(request);
    if (!auth.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const result = await pool.query('SELECT * FROM properties WHERE owner_id = $1 ORDER BY created_at DESC', [auth.user.userId]);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const auth = authenticateToken(request);
    if (!auth.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { address, unit } = await request.json();
    const propertyId = uuidv4();
    await pool.query('INSERT INTO properties (id, owner_id, address, unit, created_at) VALUES ($1, $2, $3, $4, NOW())', [propertyId, auth.user.userId, address, unit]);
    return NextResponse.json({ propertyId, address, unit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
