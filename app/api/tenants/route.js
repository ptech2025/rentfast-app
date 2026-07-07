import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../../lib/db';
import { authenticateToken } from '../../../lib/auth';
export async function POST(request) {
  try {
    const auth = authenticateToken(request);
    if (!auth.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { propertyId, name, email, rentAmount } = await request.json();
    const tenantId = uuidv4();
    await pool.query('INSERT INTO tenants (id, property_id, name, email, rent_amount, created_at) VALUES ($1, $2, $3, $4, $5, NOW())', [tenantId, propertyId, name, email, rentAmount]);
    return NextResponse.json({ tenantId, propertyId, name, email, rentAmount }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
