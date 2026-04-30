/**
 * Server-side invoice generator — returns a PDF as a Node.js Buffer.
 * Uses the same layout as generateInvoice.ts but without any browser APIs.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoiceBuffer(order: any): Buffer {
  const doc = new jsPDF();

  // ── Header ────────────────────────────────────────────
  doc.setFontSize(24);
  doc.setTextColor(234, 88, 12);
  doc.text("SPICYLON", 14, 25);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Authentic Ceylon Spices", 14, 32);

  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("INVOICE", 140, 25);
  doc.setFontSize(10);
  doc.text(`Order ID: ${order._id}`, 140, 32);
  doc.text(
    `Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`,
    140,
    38,
  );
  doc.text(`Status: PAID`, 140, 44);
  doc.text(`Payment: ${order.paymentMethod || "Stripe"}`, 140, 50);

  // ── Divider ───────────────────────────────────────────
  doc.setDrawColor(200);
  doc.line(14, 55, 196, 55);

  // ── Ship-to address ───────────────────────────────────
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("Billed To / Shipped To:", 14, 65);

  doc.setFontSize(10);
  doc.setTextColor(80);
  const addr = order.shippingAddress || {};
  const customerName =
    addr.fullName || order.userId?.name || order.user?.name || "Customer";
  doc.text(customerName, 14, 75);
  if (addr.address) doc.text(addr.address, 14, 81);
  if (addr.city || addr.postalCode)
    doc.text(`${addr.city || ""}, ${addr.postalCode || ""}`, 14, 87);
  if (addr.country) doc.text(addr.country, 14, 93);
  if (addr.phone) doc.text(`Phone: ${addr.phone}`, 14, 99);

  // ── Items table ───────────────────────────────────────
  autoTable(doc, {
    startY: 110,
    headStyles: { fillColor: [234, 88, 12] },
    head: [["Item", "Qty", "Unit Price", "Total"]],
    body: order.orderItems.map((item: any) => [
      item.name,
      item.quantity,
      `${order.currency || "USD"} ${Number(item.price).toFixed(2)}`,
      `${order.currency || "USD"} ${(item.quantity * item.price).toFixed(2)}`,
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // ── Totals ────────────────────────────────────────────
  const subtotal = order.orderItems.reduce(
    (acc: number, item: any) => acc + item.quantity * item.price,
    0,
  );
  const shippingPrice = order.shippingPrice || 0;
  const taxPrice = order.taxPrice || 0;
  const totalPrice = order.totalPrice || 0;

  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text("Subtotal:", 140, finalY);
  doc.text(`${order.currency || "USD"} ${subtotal.toFixed(2)}`, 175, finalY, {
    align: "right",
  });

  doc.text("Shipping:", 140, finalY + 8);
  doc.text(
    `${order.currency || "USD"} ${shippingPrice.toFixed(2)}`,
    175,
    finalY + 8,
    { align: "right" },
  );

  if (taxPrice > 0) {
    doc.text("Tax:", 140, finalY + 16);
    doc.text(
      `${order.currency || "USD"} ${taxPrice.toFixed(2)}`,
      175,
      finalY + 16,
      { align: "right" },
    );
  }

  const grandY = taxPrice > 0 ? finalY + 26 : finalY + 18;
  doc.setFontSize(12);
  doc.setTextColor(234, 88, 12);
  doc.text("TOTAL:", 140, grandY);
  doc.text(`${order.currency || "USD"} ${totalPrice.toFixed(2)}`, 175, grandY, {
    align: "right",
  });

  // ── Footer ────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Thank you for shopping with Spicylon!", 105, 280, {
    align: "center",
  });
  doc.text("spicylon.com", 105, 286, { align: "center" });

  // Return as Node.js Buffer (no browser APIs used)
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
