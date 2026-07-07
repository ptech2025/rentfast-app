import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../../../lib/db';
import { createToken } from '../../../../lib/auth';
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 400 });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    const token = createToken(user.id, user.email);
    return NextResponse.json({ token, userId: user.id, email: user.email, name: user.name });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
