import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order } from "@/models";
import {
  getFirstValidEmail,
  sendEmailBackground,
} from "@/lib/sendEmail";
import { buildDeliveryUpdateEmail } from "@/lib/emailTemplates";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();

    const order = await Order.findById(id).populate("userId", "email name");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const wasDelivered = order.isDelivered;
    order.isDelivered = !wasDelivered;
    order.deliveredAt = order.isDelivered ? new Date() : undefined;
    await order.save();

    const user =
      typeof order.userId === "object" && order.userId !== null
        ? (order.userId as { email?: string; name?: string })
        : null;
    const recipientEmail = getFirstValidEmail(
      user?.email,
      order.guestEmail,
      order.paymentResult?.email_address,
    );

    let emailSent = false;
    if (recipientEmail) {
      const customerName = user?.name || "Customer";

      const emailHtml = buildDeliveryUpdateEmail(
        {
          _id: String(order._id),
          orderItems: order.orderItems,
          shippingAddress: order.shippingAddress,
          itemsPrice: order.itemsPrice,
          shippingPrice: order.shippingPrice || 0,
          totalPrice: order.totalPrice,
          currency: order.currency || "USD",
          paidAt: order.paidAt,
          paymentMethod: order.paymentMethod,
        },
        customerName,
        order.isDelivered,
      );

      const statusText = order.isDelivered ? "Delivered" : "Processing";
      emailSent = await sendEmailBackground(
        recipientEmail,
        `Spicylon Order Update #${String(order._id).slice(-8).toUpperCase()} — ${statusText}`,
        emailHtml,
      );

      if (!emailSent) {
        console.error(`[Deliver] Email failed for order ${order._id}`);
      }
    }

    const orderJson = order.toJSON();
    return NextResponse.json({
      ...orderJson,
      emailSent,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
