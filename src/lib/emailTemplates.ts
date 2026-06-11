/**
 * Shared rich HTML email templates for Spicylon transactional emails.
 *
 * All templates include:
 *  - Spicylon logo (base64-embedded from public/logo.png, with text fallback)
 *  - Product image thumbnails per order item
 *  - Full product details (name, quantity, unit price, line total)
 *  - Price summary (subtotal, shipping, grand total)
 *  - Shipping address
 *  - Spicylon website CTA button
 *  - Branded footer with website link
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Logo helper
// ---------------------------------------------------------------------------

let _logoBase64Cache: string | null | undefined = undefined;

function getLogoBase64(): string | null {
  if (_logoBase64Cache !== undefined) return _logoBase64Cache;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const buf = fs.readFileSync(logoPath);
    _logoBase64Cache = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    _logoBase64Cache = null;
  }
  return _logoBase64Cache;
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function logoBlock(): string {
  const b64 = getLogoBase64();
  if (b64) {
    return `<img src="${b64}" alt="Spicylon Logo" width="54" height="54"
               style="display:block; border-radius:8px; object-fit:contain;" />`;
  }
  // Text fallback when logo file is unavailable
  return `<span style="font-size:26px; font-weight:900; font-style:italic; color:#ea580c;">Spicylon</span>`;
}

function headerSection(subtitle = "Authentic Ceylon Spices"): string {
  return `
    <div style="background:linear-gradient(135deg,#1c1917 0%,#292524 100%);
                padding:28px 40px; border-radius:16px 16px 0 0;
                display:flex; align-items:center; gap:18px;">
      <div style="flex-shrink:0;">${logoBlock()}</div>
      <div>
        <div style="font-size:24px; font-weight:900; font-style:italic;
                    color:#ea580c; letter-spacing:-1px; line-height:1;">Spicylon</div>
        <div style="font-size:12px; color:#a8a29e; margin-top:4px;">${subtitle}</div>
      </div>
    </div>`;
}

function footerSection(): string {
  return `
    <div style="background:#fafaf9; border:1px solid #e7e5e4; border-top:none;
                padding:20px 40px; border-radius:0 0 16px 16px; text-align:center;">
      <p style="margin:0 0 8px; font-size:13px; color:#78716c;">
        Questions? Contact us at
        <a href="https://spicylon.com/contact"
           style="color:#ea580c; text-decoration:none; font-weight:600;">spicylon.com/contact</a>
      </p>
      <p style="margin:0; font-size:11px; color:#a8a29e;">
        © 2026 Spicylon · Authentic Ceylon Spices ·
        <a href="https://spicylon.com" style="color:#a8a29e; text-decoration:none;">spicylon.com</a>
      </p>
    </div>`;
}

function ctaButton(label: string, url: string): string {
  return `
    <div style="text-align:center; margin:28px 0 8px;">
      <a href="${url}"
         style="display:inline-block; background:#ea580c; color:#fff;
                font-size:14px; font-weight:700; text-decoration:none;
                padding:13px 32px; border-radius:100px; letter-spacing:0.5px;">
        ${label}
      </a>
    </div>`;
}

function productImageTag(imageUrl: string | undefined | null, name: string): string {
  if (!imageUrl || imageUrl.trim() === "") {
    // Spice-themed placeholder with initials
    const initial = (name || "S").charAt(0).toUpperCase();
    return `<div style="width:56px; height:56px; border-radius:8px;
                        background:linear-gradient(135deg,#ea580c,#c2410c);
                        display:flex; align-items:center; justify-content:center;
                        font-size:22px; font-weight:900; color:#fff; flex-shrink:0;">
              ${initial}
            </div>`;
  }
  return `<img src="${imageUrl}" alt="${name}"
               width="56" height="56"
               style="border-radius:8px; object-fit:cover; display:block; flex-shrink:0;"
               onerror="this.style.display='none'" />`;
}

function orderItemsTable(
  orderItems: Array<{ name: string; image?: string; quantity: number; price: number }>,
  currency: string,
): string {
  const rows = orderItems
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#fafaf9"};">
        <td style="padding:12px 14px; border-bottom:1px solid #f5f5f4;">
          <div style="display:flex; align-items:center; gap:14px;">
            ${productImageTag(item.image, item.name)}
            <div>
              <div style="font-size:13px; font-weight:700; color:#1c1917; line-height:1.3;">
                ${item.name}
              </div>
              <div style="font-size:12px; color:#a8a29e; margin-top:3px;">
                Unit price: ${currency} ${Number(item.price).toFixed(2)}
              </div>
            </div>
          </div>
        </td>
        <td style="padding:12px 14px; font-size:13px; color:#78716c;
                   text-align:center; border-bottom:1px solid #f5f5f4; white-space:nowrap;">
          × ${item.quantity}
        </td>
        <td style="padding:12px 14px; font-size:13px; font-weight:700; color:#1c1917;
                   text-align:right; border-bottom:1px solid #f5f5f4; white-space:nowrap;">
          ${currency} ${(item.quantity * item.price).toFixed(2)}
        </td>
      </tr>`,
    )
    .join("");

  return `
    <table style="width:100%; border-collapse:collapse; margin-bottom:4px;">
      <thead>
        <tr style="background:#1c1917;">
          <th style="text-align:left; padding:10px 14px; font-size:11px; font-weight:700;
                     text-transform:uppercase; letter-spacing:1px; color:#d6d3d1;
                     border-radius:8px 0 0 8px;">Product</th>
          <th style="text-align:center; padding:10px 14px; font-size:11px; font-weight:700;
                     text-transform:uppercase; letter-spacing:1px; color:#d6d3d1;">Qty</th>
          <th style="text-align:right; padding:10px 14px; font-size:11px; font-weight:700;
                     text-transform:uppercase; letter-spacing:1px; color:#d6d3d1;
                     border-radius:0 8px 8px 0;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function priceSummary(
  currency: string,
  itemsPrice: number,
  shippingPrice: number,
  totalPrice: number,
): string {
  return `
    <div style="border-top:2px solid #e7e5e4; padding-top:16px; margin-top:8px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span style="font-size:13px; color:#78716c;">Subtotal</span>
        <span style="font-size:13px; color:#1c1917; font-weight:600;">
          ${currency} ${itemsPrice.toFixed(2)}
        </span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span style="font-size:13px; color:#78716c;">Shipping</span>
        <span style="font-size:13px; color:#1c1917; font-weight:600;">
          ${shippingPrice > 0 ? `${currency} ${shippingPrice.toFixed(2)}` : "Free"}
        </span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top:10px;
                  padding-top:10px; border-top:1px solid #e7e5e4;">
        <span style="font-size:15px; font-weight:900; color:#1c1917;">Total Paid</span>
        <span style="font-size:15px; font-weight:900; color:#ea580c;">
          ${currency} ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>`;
}

function shippingAddressBlock(
  addr: {
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  } | null | undefined,
  customerName: string,
): string {
  if (!addr || (!addr.fullName && !addr.address)) return "";
  const addressLine = [addr.address, addr.city, addr.postalCode, addr.country]
    .filter(Boolean)
    .join(", ");
  return `
    <div style="margin-top:24px; padding:18px 20px; background:#fafaf9;
                border:1px solid #e7e5e4; border-radius:12px;">
      <p style="margin:0 0 8px; font-size:11px; font-weight:700;
                text-transform:uppercase; letter-spacing:1px; color:#a8a29e;">Ships To</p>
      <p style="margin:0; font-size:13px; font-weight:700; color:#1c1917;">
        ${addr.fullName || customerName}
      </p>
      ${addressLine ? `<p style="margin:3px 0 0; font-size:13px; color:#78716c;">${addressLine}</p>` : ""}
      ${addr.phone ? `<p style="margin:3px 0 0; font-size:13px; color:#78716c;">📞 ${addr.phone}</p>` : ""}
    </div>`;
}

// ---------------------------------------------------------------------------
// Public template builders
// ---------------------------------------------------------------------------

export interface OrderEmailData {
  _id: string;
  orderItems: Array<{
    name: string;
    image?: string;
    quantity: number;
    price: number;
  }>;
  // Mongoose may return null for optional embedded documents
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  } | null;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  currency: string;
  // Mongoose NativeDate is assignable to Date; allow null too
  paidAt?: Date | string | null;
  paymentMethod?: string;
}

/**
 * Builds the rich HTML for a Payment / Order Confirmation email.
 * Used by both the Stripe webhook handler and the admin /pay route.
 */
export function buildPaymentConfirmationEmail(
  order: OrderEmailData,
  customerName: string,
): string {
  const currency = order.currency || "USD";
  const orderId = String(order._id).slice(-8).toUpperCase();
  const addr = (order.shippingAddress || {}) as NonNullable<OrderEmailData["shippingAddress"]>;
  const itemsPrice = Number(order.itemsPrice || 0);
  const shippingPrice = Number(order.shippingPrice || 0);
  const totalPrice = Number(order.totalPrice || 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Spicylon</title>
</head>
<body style="margin:0; padding:24px 0; background:#f5f5f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:620px; margin:0 auto; color:#1c1917;">

    ${headerSection()}

    <div style="background:#fff; padding:36px 40px; border:1px solid #e7e5e4; border-top:none;">

      <!-- Status badge -->
      <div style="display:inline-block; background:#dcfce7; color:#15803d; font-size:11px;
                  font-weight:700; text-transform:uppercase; letter-spacing:1px;
                  padding:5px 14px; border-radius:100px; margin-bottom:22px;">
        ✅ Payment Confirmed
      </div>

      <!-- Greeting -->
      <h2 style="margin:0 0 8px; font-size:22px; font-weight:900; color:#1c1917;">
        Thank you, ${customerName}!
      </h2>
      <p style="margin:0 0 24px; color:#78716c; font-size:14px; line-height:1.6;">
        Your order has been confirmed and we're already preparing your authentic
        Ceylon spices for shipment. Your invoice is attached to this email as a PDF.
      </p>

      <!-- Order reference -->
      <div style="background:#fafaf9; border:1px solid #e7e5e4; border-radius:12px;
                  padding:16px 20px; margin-bottom:24px;">
        <p style="margin:0 0 3px; font-size:11px; font-weight:700; text-transform:uppercase;
                  letter-spacing:1px; color:#a8a29e;">Order Reference</p>
        <p style="margin:0; font-family:monospace; font-size:16px; font-weight:700;
                  color:#1c1917;">#${orderId}</p>
      </div>

      <!-- Product table with images -->
      ${orderItemsTable(order.orderItems, currency)}

      <!-- Price summary -->
      ${priceSummary(currency, itemsPrice, shippingPrice, totalPrice)}

      <!-- Shipping address -->
      ${shippingAddressBlock(addr, customerName)}

      <!-- CTA -->
      ${ctaButton("Visit Spicylon", "https://spicylon.com")}

      <p style="margin:20px 0 0; font-size:12px; color:#a8a29e; text-align:center; line-height:1.6;">
        We'll send you another email once your order ships.
      </p>
    </div>

    ${footerSection()}
  </div>
</body>
</html>`;
}

/**
 * Builds the rich HTML for a Delivery Status Update email.
 * Used by the admin /deliver route.
 */
export function buildDeliveryUpdateEmail(
  order: OrderEmailData,
  customerName: string,
  isDelivered: boolean,
): string {
  const currency = order.currency || "USD";
  const orderId = String(order._id).slice(-8).toUpperCase();
  const itemsPrice = Number(order.itemsPrice || 0);
  const shippingPrice = Number(order.shippingPrice || 0);
  const totalPrice = Number(order.totalPrice || 0);

  const statusBadge = isDelivered
    ? `<div style="display:inline-block; background:#dcfce7; color:#15803d; font-size:11px;
                   font-weight:700; text-transform:uppercase; letter-spacing:1px;
                   padding:5px 14px; border-radius:100px; margin-bottom:22px;">
         🎉 Delivered
       </div>`
    : `<div style="display:inline-block; background:#fef9c3; color:#a16207; font-size:11px;
                   font-weight:700; text-transform:uppercase; letter-spacing:1px;
                   padding:5px 14px; border-radius:100px; margin-bottom:22px;">
         🔄 Back in Processing
       </div>`;

  const headline = isDelivered
    ? `Your order has arrived, ${customerName}!`
    : `Your order is back in processing, ${customerName}`;

  const bodyText = isDelivered
    ? `Your authentic Ceylon spices for order <strong>#${orderId}</strong> have been marked as
       <strong>Delivered</strong>. We hope you enjoy every flavour! If you have any questions
       or concerns about your delivery, don't hesitate to get in touch.`
    : `Your order <strong>#${orderId}</strong> has been updated back to processing status.
       Our team will continue preparing your spices for shipment and you'll receive another
       update when they're on their way.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Update — Spicylon</title>
</head>
<body style="margin:0; padding:24px 0; background:#f5f5f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:620px; margin:0 auto; color:#1c1917;">

    ${headerSection()}

    <div style="background:#fff; padding:36px 40px; border:1px solid #e7e5e4; border-top:none;">

      <!-- Status badge -->
      ${statusBadge}

      <!-- Greeting -->
      <h2 style="margin:0 0 8px; font-size:22px; font-weight:900; color:#1c1917;">
        ${headline}
      </h2>
      <p style="margin:0 0 24px; color:#78716c; font-size:14px; line-height:1.6;">
        ${bodyText}
      </p>

      <!-- Order reference -->
      <div style="background:#fafaf9; border:1px solid #e7e5e4; border-radius:12px;
                  padding:16px 20px; margin-bottom:24px;">
        <p style="margin:0 0 3px; font-size:11px; font-weight:700; text-transform:uppercase;
                  letter-spacing:1px; color:#a8a29e;">Order Reference</p>
        <p style="margin:0; font-family:monospace; font-size:16px; font-weight:700;
                  color:#1c1917;">#${orderId}</p>
      </div>

      <!-- Product table with images -->
      ${orderItemsTable(order.orderItems, currency)}

      <!-- Price summary -->
      ${priceSummary(currency, itemsPrice, shippingPrice, totalPrice)}

      <!-- CTA -->
      ${ctaButton(isDelivered ? "Shop Again at Spicylon" : "View Your Order", "https://spicylon.com")}

    </div>

    ${footerSection()}
  </div>
</body>
</html>`;
}
