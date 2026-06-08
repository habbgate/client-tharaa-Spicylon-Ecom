import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import { Order, Product, User } from '@/models';
import { sendEmailBackground } from '@/lib/sendEmail';
import { generateInvoiceBuffer } from '@/lib/generateInvoiceBuffer';

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
    const items = JSON.parse(metadata.items || '[]');
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
      const addr = shipping as {
        fullName?: string;
        address?: string;
        city?: string;
        postalCode?: string;
        country?: string;
        phone?: string;
      };
      const currency = (metadata.currency || session.currency || 'USD').toUpperCase();

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: auto; color: #1c1917;">
          <div style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); padding: 32px 40px; border-radius: 16px 16px 0 0;">
            <h1 style="margin: 0; font-size: 28px; font-style: italic; font-weight: 900; color: #ea580c; letter-spacing: -1px;">Spicylon</h1>
            <p style="margin: 6px 0 0; color: #a8a29e; font-size: 13px;">Authentic Ceylon Spices</p>
          </div>

          <div style="background: #fff; padding: 36px 40px; border: 1px solid #e7e5e4; border-top: none;">
            <div style="display: inline-block; background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px;">
              Payment Confirmed
            </div>

            <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 900; color: #1c1917;">Thank you, ${customerName}!</h2>
            <p style="margin: 0 0 28px; color: #78716c; font-size: 14px; line-height: 1.6;">
              Your order has been confirmed and we're already preparing your spices for shipment.
              Your invoice is attached to this email as a PDF.
            </p>

            <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e;">Order Reference</p>
              <p style="margin: 0; font-family: monospace; font-size: 15px; font-weight: 700; color: #1c1917;">#${String(order._id).slice(-8).toUpperCase()}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #1c1917;">
                  <th style="text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d6d3d1; border-radius: 8px 0 0 8px;">Item</th>
                  <th style="text-align: center; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d6d3d1;">Qty</th>
                  <th style="text-align: right; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d6d3d1; border-radius: 0 8px 8px 0;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map((item: any, i: number) => `
                  <tr style="border-bottom: 1px solid #f5f5f4; background: ${i % 2 === 0 ? '#fff' : '#fafaf9'};">
                    <td style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #1c1917;">${item.name}</td>
                    <td style="padding: 12px 14px; font-size: 13px; color: #78716c; text-align: center;">${item.quantity}</td>
                    <td style="padding: 12px 14px; font-size: 13px; font-weight: 600; color: #1c1917; text-align: right;">${currency} ${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>

            <div style="border-top: 2px solid #e7e5e4; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 13px; color: #78716c;">Shipping</span>
                <span style="font-size: 13px; color: #1c1917; font-weight: 600;">${currency} ${deliveryAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e7e5e4;">
                <span style="font-size: 15px; font-weight: 900; color: #1c1917;">Total Paid</span>
                <span style="font-size: 15px; font-weight: 900; color: #ea580c;">${currency} ${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            ${addr.fullName || addr.address ? `
            <div style="margin-top: 28px; padding: 18px 20px; background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px;">
              <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e;">Ships To</p>
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1c1917;">${addr.fullName || customerName}</p>
              <p style="margin: 2px 0 0; font-size: 13px; color: #78716c;">${[addr.address, addr.city, addr.postalCode, addr.country].filter(Boolean).join(', ')}</p>
              ${addr.phone ? `<p style="margin: 2px 0 0; font-size: 13px; color: #78716c;">${addr.phone}</p>` : ''}
            </div>` : ''}

            <p style="margin: 28px 0 0; font-size: 13px; color: #78716c; line-height: 1.6;">
              We'll send you another email once your order ships. If you have any questions, visit
              <a href="https://spicylon.com/contact" style="color: #ea580c; text-decoration: none; font-weight: 600;">spicylon.com/contact</a>.
            </p>
          </div>

          <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-top: none; padding: 20px 40px; border-radius: 0 0 16px 16px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #a8a29e;">© 2026 Spicylon · Authentic Ceylon Spices</p>
          </div>
        </div>
      `;

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
