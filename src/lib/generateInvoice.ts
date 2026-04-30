import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function toDataUrl(src: string, w: number, h: number): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export const generateInvoice = async (order: any) => {
  const logoData = await toDataUrl("/logo.png", 200, 200);
  const doc = new jsPDF();
  const PW = 210; // A4 page width in mm

  // ── HEADER BAR ─────────────────────────────────────────────────
  // Dark background
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, PW, 38, "F");

  // Orange left accent stripe
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, 6, 38, "F");

  // Logo — large, vertically centred in bar
  if (logoData) {
    doc.addImage(logoData, "PNG", 12, 4, 28, 28);
  }

  // Brand subtitle beside logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("AUTHENTIC CEYLON SPICES", 44, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text("spicylon.com", 44, 23);

  // "INVOICE" label — right side of header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", PW - 14, 24, { align: "right" });

  // Orange accent line below header
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.8);
  doc.line(0, 38, PW, 38);

  // ── ORDER META (below header) ───────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const metaX = PW - 14;
  const metaStartY = 47;
  const lineH = 6;
  doc.text(`Order ID: ${order._id}`, metaX, metaStartY, { align: "right" });
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    metaX,
    metaStartY + lineH,
    { align: "right" },
  );

  // Status pill
  const status = order.isPaid ? "PAID" : "PENDING";
  const pillColor: [number, number, number] = order.isPaid
    ? [22, 163, 74]
    : [234, 88, 12];
  doc.setFillColor(...pillColor);
  doc.roundedRect(
    metaX - 18,
    metaStartY + lineH * 2 - 4,
    22,
    6.5,
    1.5,
    1.5,
    "F",
  );
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(status, metaX - 7, metaStartY + lineH * 2 + 0.8, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `Payment: ${order.paymentMethod || "Stripe"}`,
    metaX,
    metaStartY + lineH * 3,
    { align: "right" },
  );

  // ── SHIP-TO SECTION ────────────────────────────────────────────
  const addr = order.shippingAddress || {};
  const sectionY = 47;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("BILLED TO / SHIPPED TO", 14, sectionY);

  // Thin orange underline under label
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.4);
  doc.line(14, sectionY + 2, 75, sectionY + 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 15, 15);
  doc.text(addr.fullName || order.user?.name || "Customer", 14, sectionY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  let addrY = sectionY + 17;
  if (addr.address) {
    doc.text(addr.address, 14, addrY);
    addrY += 6;
  }
  if (addr.city || addr.postalCode) {
    doc.text(`${addr.city || ""}, ${addr.postalCode || ""}`, 14, addrY);
    addrY += 6;
  }
  if (addr.country) {
    doc.text(addr.country, 14, addrY);
    addrY += 6;
  }
  if (addr.phone) {
    doc.text(`Phone: ${addr.phone}`, 14, addrY);
    addrY += 6;
  }

  // Section divider
  const divY = Math.max(addrY + 4, metaStartY + lineH * 3 + 10);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.4);
  doc.line(14, divY, PW - 14, divY);

  // ── ITEMS TABLE ────────────────────────────────────────────────
  autoTable(doc, {
    startY: divY + 6,
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [15, 15, 15],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: [250, 250, 249] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
    head: [["Item", "Qty", "Unit Price", "Total"]],
    body: order.orderItems.map((item: any) => [
      item.name,
      item.quantity,
      `${order.currency || "USD"} ${Number(item.price).toFixed(2)}`,
      `${order.currency || "USD"} ${(item.quantity * item.price).toFixed(2)}`,
    ]),
  });

  const tableEndY = (doc as any).lastAutoTable.finalY;

  // ── TOTALS BLOCK ───────────────────────────────────────────────
  const subtotal = order.orderItems.reduce(
    (acc: number, item: any) => acc + item.quantity * item.price,
    0,
  );
  const shippingPrice = order.shippingPrice || 0;
  const taxPrice = order.taxPrice || 0;
  const totalPrice = order.totalPrice || 0;

  const totalsX = PW - 14;
  const labelX = PW - 55;
  let totY = tableEndY + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 80);

  doc.text("Subtotal:", labelX, totY);
  doc.text(`${order.currency || "USD"} ${subtotal.toFixed(2)}`, totalsX, totY, {
    align: "right",
  });

  totY += 7;
  doc.text("Shipping:", labelX, totY);
  doc.text(
    `${order.currency || "USD"} ${shippingPrice.toFixed(2)}`,
    totalsX,
    totY,
    { align: "right" },
  );

  if (taxPrice > 0) {
    totY += 7;
    doc.text("Tax:", labelX, totY);
    doc.text(
      `${order.currency || "USD"} ${taxPrice.toFixed(2)}`,
      totalsX,
      totY,
      { align: "right" },
    );
  }

  // Total row with background
  totY += 9;
  doc.setFillColor(15, 15, 15);
  doc.roundedRect(
    labelX - 4,
    totY - 5.5,
    totalsX - labelX + 4 + 4,
    10,
    2,
    2,
    "F",
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", labelX, totY + 1.5);
  doc.setTextColor(234, 88, 12);
  doc.text(
    `${order.currency || "USD"} ${totalPrice.toFixed(2)}`,
    totalsX,
    totY + 1.5,
    { align: "right" },
  );

  // ── FOOTER ─────────────────────────────────────────────────────
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 282, PW, 15, "F");
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 282, 6, 15, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(
    "Thank you for shopping with Spicylon!  ·  spicylon.com",
    PW / 2,
    291,
    { align: "center" },
  );

  // Open in new tab
  doc.autoPrint();
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    doc.save(`Invoice_Spicylon_${order._id.slice(-8)}.pdf`);
  }
};
