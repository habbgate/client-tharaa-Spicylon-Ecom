import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import { Order, Product, User } from '@/models';
import { sendEmailBackground } from '@/lib/sendEmail';
import { generateInvoiceBuffer } from '@/lib/generateInvoiceBuffer';
import { buildPaymentConfirmationEmail } from '@/lib/emailTemplates';

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

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.payment_status !== 'paid' && event.type !== 'checkout.session.async_payment_succeeded') {
      return NextResponse.json({ received: true, ignored: 'unpaid_session' });
    }

    await dbConnect();

    const metadata = session.metadata || {};

    let itemsStr = metadata.items || '';
    if (!itemsStr) {
      for (let i = 0; i < 50; i++) {
        if (metadata[`items_${i}`]) {
          itemsStr += metadata[`items_${i}`];
        } else {
          break;
        }
      }
    }
    const items = JSON.parse(itemsStr || '[]');
    const shipping = JSON.parse(metadata.shipping || '{}');
    const guestEmail = metadata.guestEmail || '';
    const currency = (metadata.currency || session.currency || 'USD').toUpperCase();
    const deliveryAmount = Number(metadata.deliveryAmount || 0);
    const sessionEmail = session.customer_details?.email || guestEmail;
    const paymentKey = typeof session.payment_intent === 'string' ? session.payment_intent : session.id;

    const existing = await Order.findOne({ 'paymentResult.id': paymentKey } as any);
    if (existing) {
      return NextResponse.json({ received: true, orderId: existing._id });
    }

    const orderItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image || '',
      price: Number(item.price || 0),
      product: item.id || null,
    }));

    let userId: any = undefined;
    if (sessionEmail) {
      const user = await User.findOne({ email: sessionEmail });
      if (user) userId = user._id;
    }

    const itemsPrice = orderItems.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
    const totalPrice = itemsPrice + deliveryAmount;

    const order = await Order.create({
      userId: userId || undefined,
      guestEmail: userId ? undefined : sessionEmail || '',
      orderItems,
      shippingAddress: {
        fullName: shipping.fullName || session.customer_details?.name || '',
        address: shipping.address || '',
        city: shipping.city || '',
        postalCode: shipping.postalCode || '',
        country: shipping.country || session.customer_details?.address?.country || '',
        phone: shipping.phone || '',
      },
      paymentMethod: 'Stripe',
      paymentResult: {
        id: paymentKey,
        status: 'paid',
        email_address: sessionEmail || '',
      },
      itemsPrice,
      shippingPrice: deliveryAmount,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      currency,
    });

    for (const item of order.orderItems) {
      if (!item.product) continue;
      const product = await Product.findById(item.product);
      if (!product) continue;
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }

    const recipientEmail = sessionEmail;
    if (recipientEmail) {
      const customerName = session.customer_details?.name || shipping.fullName || 'Customer';

      const emailHtml = buildPaymentConfirmationEmail(
        {
          _id: String(order._id),
          orderItems: order.orderItems,
          shippingAddress: order.shippingAddress,
          itemsPrice,
          shippingPrice: deliveryAmount,
          totalPrice,
          currency,
          paidAt: order.paidAt,
          paymentMethod: order.paymentMethod,
        },
        customerName,
      );

      let attachments: any[] = [];
      try {
        const pdfBuffer = generateInvoiceBuffer(order);
        attachments = [
          {
            filename: `Invoice_Spicylon_${String(order._id).slice(-8).toUpperCase()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ];
      } catch (pdfErr) {
        console.error(`[Webhook] PDF generation failed for order ${order._id}:`, pdfErr);
      }

      const emailSent = await sendEmailBackground(
        recipientEmail,
        `Order Confirmed — Spicylon #${String(order._id).slice(-8).toUpperCase()}`,
        emailHtml,
        attachments.length > 0 ? attachments : undefined,
      );

      if (!emailSent) {
        console.error(`[Webhook] Payment succeeded but email failed for order ${order._id}`);
      }
    }

    console.log('Payment successful for session:', session.id);
  }

  return NextResponse.json({ received: true });
}
