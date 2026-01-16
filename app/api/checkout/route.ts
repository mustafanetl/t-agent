import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ userId: z.string(), email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  if (!stripeSecret || !priceId) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const customerId =
    user.stripeCustomerId ??
    (await stripe.customers.create({ email: parsed.data.email })).id;

  if (!user.stripeCustomerId) {
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=cancel`,
    metadata: { userId: user.id }
  });

  return NextResponse.json({ url: session.url });
}
