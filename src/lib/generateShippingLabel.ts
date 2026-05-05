import jsPDF from "jspdf";

async function toDataUrl(
  src: string,
  w: number,
  h: number,
): Promise<string | null> {
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

// 102 x 152 mm shipping label
export const generateShippingLabel = async (order: any) => {
  const W = 102;
  const H = 152;
  const doc = new jsPDF({
    unit: "mm",
    format: [W, H],
    orientation: "portrait",
  });

  const addr = order.shippingAddress || {};
  const orderId = String(order._id || "");
  const shortId = orderId.slice(-12).toUpperCase();
  const date = new Date(order.createdAt || Date.now()).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
  const itemCount = (order.orderItems || []).reduce(
    (a: number, i: any) => a + (i.quantity || 1),
    0,
  );
  const recipientName = addr.fullName || order.userId?.name || "Customer";

  const [logoData, qrData] = await Promise.all([
    toDataUrl("/logolabel.jpeg", 200, 200),
    toDataUrl("/logoqr.svg", 200, 200),
  ]);

  // ── White canvas ────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // ── Outer border ────────────────────────────────────────────────
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.35);
  doc.roundedRect(2, 2, W - 4, H - 4, 3, 3);

  // ── HEADER — dark bar (h = 24 mm) ───────────────────────────────
  const HEADER_H = 24;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(2, 2, W - 4, HEADER_H, 3, 3, "F");
  doc.rect(2, 14, W - 4, HEADER_H - 12, "F"); // flatten bottom corners

  // Logo — centred vertically in bar: bar interior y=2..26, logo 18×18
  const LOGO_SIZE = 18;
  const logoY = 2 + (HEADER_H - LOGO_SIZE) / 2; // = 5  → centred
  if (logoData) {
    doc.addImage(logoData, "PNG", 9, logoY, LOGO_SIZE, LOGO_SIZE);
  }

  // Subtitle text — vertically centred alongside logo
  const textX = 9 + LOGO_SIZE + 3; // = 30
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(80, 80, 80);
  doc.text("AUTHENTIC CEYLON SPICES", textX, 12);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("spicylon.com", textX, 17);

  // QR code — right side of header, vertically centred
  const HEADER_QR = 18;
  const headerQrX = W - 2 - HEADER_QR - 3; // 3 mm from right edge
  const headerQrY = 2 + (HEADER_H - HEADER_QR) / 2; // vertically centred
  if (qrData) {
    doc.addImage(qrData, "PNG", headerQrX, headerQrY, HEADER_QR, HEADER_QR);
  }

  // Accent line under header
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.5);
  doc.line(2, 2 + HEADER_H, W - 2, 2 + HEADER_H);

  // ── Dashed-line helper ──────────────────────────────────────────
  const dashed = (y: number) => {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.22);
    for (let x = 4; x < W - 4; x += 3.5)
      doc.line(x, y, Math.min(x + 2, W - 4), y);
  };

  // ── FROM ────────────────────────────────────────────────────────
  const fromTop = 28;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(4, fromTop, 13, 4.5, 1.2, 1.2, "F");
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("FROM", 10.5, fromTop + 3.2, { align: "center" });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Spicylon — Ceylon Spice Trading Co.", 4, fromTop + 11);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110, 110, 110);
  doc.text("Highland Farms District, Sri Lanka", 4, fromTop + 17);
  doc.text("support@spicylon.com", 4, fromTop + 22);

  dashed(fromTop + 26);

  // ── TO ──────────────────────────────────────────────────────────
  const toTop = fromTop + 30;
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 120);
  doc.text("DELIVER TO", 4, toTop + 3.4);

  // Recipient name
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  const nameStr = doc.splitTextToSize(recipientName, W - 10)[0];
  doc.text(nameStr, 4, toTop + 13);
  // Underline
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.55);
  doc.line(4, toTop + 15, 4 + doc.getTextWidth(nameStr), toTop + 15);

  // Address block
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 55, 55);
  let ay = toTop + 22;
  const lines: string[] = [];
  if (addr.address) lines.push(addr.address);
  if (addr.city || addr.postalCode)
    lines.push([addr.city, addr.postalCode].filter(Boolean).join(", "));
  if (addr.country) lines.push(addr.country);
  if (addr.phone) lines.push("Tel: " + addr.phone);
  lines.forEach((ln) => {
    doc.splitTextToSize(ln, W - 10).forEach((l: string) => {
      doc.text(l, 4, ay);
      ay += 5;
    });
  });

  dashed(ay + 2);

  // ── ORDER META ──────────────────────────────────────────────────
  const metaTop = ay + 7;
  const halfW = (W - 12) / 2;

  // ORDER REF box
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(4, metaTop, halfW, 13, 2, 2, "F");
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("ORDER REF", 4 + halfW / 2, metaTop + 4, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text("#" + shortId.slice(-8), 4 + halfW / 2, metaTop + 10, {
    align: "center",
  });

  // DATE box
  const bx2 = 4 + halfW + 4;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(bx2, metaTop, halfW, 13, 2, 2, "F");
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("DISPATCH DATE", bx2 + halfW / 2, metaTop + 4, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text(date, bx2 + halfW / 2, metaTop + 10, { align: "center" });

  // ── PILLS ───────────────────────────────────────────────────────
  const pillTop = metaTop + 17;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(4, pillTop, 26, 6.5, 2, 2, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text(
    itemCount + " ITEM" + (itemCount !== 1 ? "S" : ""),
    17,
    pillTop + 4.4,
    { align: "center" },
  );

  doc.setFillColor(245, 245, 244);
  doc.roundedRect(34, pillTop, 42, 6.5, 2, 2, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("HANDLE WITH CARE", 55, pillTop + 4.4, { align: "center" });

  // ── FOOTER ──────────────────────────────────────────────────────
  const footerY = H - 13;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(2, footerY, W - 4, H - footerY - 2, 3, 3, "F");
  doc.rect(2, footerY, W - 4, 5, "F");

  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(
    "spicylon.com  ·  Authentic Ceylon Spices  ·  Est. 2026",
    W / 2,
    footerY + 6,
    { align: "center" },
  );
  doc.setFontSize(4.5);
  doc.setTextColor(150, 150, 150);
  doc.text("Keep dry  ·  Fragile contents", W / 2, footerY + 10.5, {
    align: "center",
  });

  // ── Print ───────────────────────────────────────────────────────
  doc.autoPrint();
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) doc.save("ShippingLabel_" + shortId + ".pdf");
};
