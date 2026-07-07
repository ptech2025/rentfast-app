import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../../lib/db';
import { createToken } from '../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users (id, email, password, name, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [userId, email, hashedPassword, name]
    );
    const token = createToken(userId, email);
    return NextResponse.json({ token, userId, email, name }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
