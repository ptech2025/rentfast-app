import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import pool from '../../../lib/db';

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { tenantId, amount, paymentMethodId, type } = await request.json();
    const tenantResult = await pool.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    if (tenantResult.rows.length === 0) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    const tenant = tenantResult.rows[0];
    const paymentId = uuidv4();
    let stripePaymentId = null;
    if (type === 'card' || type === 'ach') {
      const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency: 'usd', payment_method: paymentMethodId, confirm: true, description: `Rent payment for ${tenant.name}` });
      stripePaymentId = paymentIntent.id;
      if (paymentIntent.status !== 'succeeded') return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
    }
    await pool.query('INSERT INTO payments (id, tenant_id, amount, type, stripe_payment_id, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())', [paymentId, tenantId, amount, type, stripePaymentId, 'completed']);
    return NextResponse.json({ paymentId, status: 'success' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    const result = await pool.query('SELECT * FROM payments WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
