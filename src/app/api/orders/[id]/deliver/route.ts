import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order } from "@/models";
import {
  getFirstValidEmail,
  sendEmailBackground,
} from "@/lib/sendEmail";

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
      const statusText = order.isDelivered ? "Delivered" : "Processing";
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ea580c; font-style: italic;">Spicylon Update</h2>
          <h3>Order #${order._id} Status: ${statusText}</h3>
          <p>Hi ${user?.name || "Customer"},</p>
          <p>Your order delivery status has been updated by our admin team.</p>
          ${
            order.isDelivered
              ? "<p><strong>Your authentic Ceylon spices have been marked as delivered.</strong></p>"
              : "<p>Your order is back in processing and will continue toward shipment.</p>"
          }
          <p>Thank you for shopping at Spicylon!</p>
        </div>
      `;

      emailSent = await sendEmailBackground(
        recipientEmail,
        `Spicylon Order Update #${order._id} - ${statusText}`,
        emailHtml,
      );
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
