import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: Request) {
  try {
    const {
      items,
      email,
      currency,
      deliveryAmount,
      shipping,
      guestEmail,
    } = await req.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (deliveryAmount > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryAmount * 100),
        },
        quantity: 1,
      });
    }

    const requestUrl = new URL(req.url);
    const origin = req.headers.get("origin");
    const baseUrl = origin || `${requestUrl.protocol}//${requestUrl.host}`;

    // Build payment methods; only include TWINT when appropriate.
    const paymentMethods = ["card"] as string[];
    // Optional: enable TWINT via env var or when currency is CHF
    const allowTwint = process.env.ENABLE_TWINT === "1" ||
      (currency && currency.toLowerCase() === "chf");

    if (allowTwint) paymentMethods.push("twint");

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: paymentMethods as any,
        line_items: lineItems,
        mode: "payment",
        success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cart`,
        // Stripe requires a valid email or no field at all
        ...(email ? { customer_email: email } : {}),
        metadata: {
          items: JSON.stringify(items || []),
          shipping: JSON.stringify(shipping || {}),
          guestEmail: guestEmail || "",
          currency: currency || "USD",
          deliveryAmount: String(deliveryAmount || 0),
        },
      });

      return NextResponse.json({ id: session.id, url: session.url, twint: paymentMethods.includes("twint") });
    } catch (err: any) {
      // If Stripe rejects the session due to an unsupported payment method (e.g., twint),
      // retry without TWINT so checkout still works for cards.
      const msg = err?.message || "";
      if (allowTwint && /twint|payment method type provided/i.test(msg)) {
        try {
          const fallbackSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cart`,
            ...(email ? { customer_email: email } : {}),
            metadata: {
              items: JSON.stringify(items || []),
              shipping: JSON.stringify(shipping || {}),
              guestEmail: guestEmail || "",
              currency: currency || "USD",
              deliveryAmount: String(deliveryAmount || 0),
            },
          });

          return NextResponse.json({
            id: fallbackSession.id,
            url: fallbackSession.url,
            twint: false,
            warning: "TWINT is not enabled for your Stripe account; proceeding with card payments only.",
          });
        } catch (err2: any) {
          return NextResponse.json({ message: err2?.message || String(err2) }, { status: 500 });
        }
      }

      return NextResponse.json({ message: msg }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
