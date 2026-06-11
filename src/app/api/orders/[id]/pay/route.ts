import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order, Product } from "@/models";
import { getFirstValidEmail, sendEmailBackground } from "@/lib/sendEmail";
import { generateInvoiceBuffer } from "@/lib/generateInvoiceBuffer";
import { buildPaymentConfirmationEmail } from "@/lib/emailTemplates";

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

    const wasPaid = order.isPaid;
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
    await order.save();

    for (const item of order.orderItems) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }
    }

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
    if (recipientEmail && !wasPaid) {
      const customerName = user?.name || "Customer";

      const emailHtml = buildPaymentConfirmationEmail(
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
      );

      let attachments: import("nodemailer").SendMailOptions["attachments"] = undefined;
      try {
        const pdfBuffer = generateInvoiceBuffer(order);
        attachments = [
          {
            filename: `Invoice_Spicylon_${String(order._id).slice(-8).toUpperCase()}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ];
      } catch (pdfErr) {
        console.error(`[Pay] PDF generation failed for order ${order._id}:`, pdfErr);
      }

      emailSent = await sendEmailBackground(
        recipientEmail,
        `Order Confirmed — Spicylon #${String(order._id).slice(-8).toUpperCase()}`,
        emailHtml,
        attachments,
      );
    }

    if (recipientEmail && wasPaid) {
      console.log(`[Email] Skipped duplicate invoice email for already paid order ${order._id}`);
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
