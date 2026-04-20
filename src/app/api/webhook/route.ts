import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
  } catch (err: any) {
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await dbConnect();
    // Here you would find the order and mark it as paid
    // Since we create orders after payment success in this simplified flow, 
    // we would handle it here or in the success page redirect.
    // Professional way: Create order with 'pending' status BEFORE checkout, 
    // then update here.
    
    console.log('Payment successful for session:', session.id);
  }

  return NextResponse.json({ received: true });
}
