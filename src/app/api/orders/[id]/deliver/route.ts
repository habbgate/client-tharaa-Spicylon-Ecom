import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';
import { sendEmailBackground } from '@/lib/sendEmail';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const order = await Order.findById(id).populate('userId', 'email name');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.isDelivered = !order.isDelivered;
    if (order.isDelivered) {
      order.deliveredAt = Date.now();
    } else {
      order.deliveredAt = undefined;
    }

    await order.save();

    // Customer email notification for delivery status change
    if (order.userId && order.userId.email) {
      const isDelivered = order.isDelivered;
      const statusText = isDelivered ? 'Delivered' : 'En Route / Not Delivered';
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ea580c; font-style: italic;">Spicylon Update</h2>
          <h3>Order #${order._id} Status: ${statusText}</h3>
          <p>Hi ${order.userId.name || 'Customer'},</p>
          <p>Your order status has been updated by our admin team.</p>
          ${isDelivered ? '<p><strong>🎉 Great news! Your authentic Ceylon spices have been marked as delivered.</strong></p>' 
                        : '<p>Your order delivery status was reversed to pending delivery.</p>'}
          <p>Thank you for shopping at Spicylon!</p>
        </div>
      `;

      sendEmailBackground(
        order.userId.email,
        `Spicylon Order Update #${order._id} - ${statusText}`,
        emailHtml
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
