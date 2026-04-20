import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';
import { sendEmailBackground } from '@/lib/sendEmail';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const order = await Order.findById(id).populate('userId', 'email name');
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    // Trigger an email to the user regarding the successful payment
    if (order.userId && order.userId.email) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ea580c; font-style: italic;">Spicylon</h2>
          <h3>Payment Confirmed - Order #${order._id}</h3>
          <p>Hi ${order.userId.name || 'Customer'},</p>
          <p>Great news! We've received your payment and your order is confirmed.</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px;">
            <h4>Order Summary:</h4>
            <ul>
              ${order.orderItems.map((item: any) => `<li>${item.name} (x${item.quantity}) - ${order.currency || 'USD'} ${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Total Paid: ${order.currency || 'USD'} ${order.totalPrice.toFixed(2)}</strong></p>
          </div>
          <p>We are preparing your spices for shipment. You will receive another email once it's on the way!</p>
          <p>Thank you for choosing Spicylon.</p>
        </div>
      `;

      sendEmailBackground(
        order.userId.email,
        `Payment Confirmed - Your Spicylon Order #${order._id}`,
        emailHtml
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

