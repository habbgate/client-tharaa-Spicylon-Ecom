import jsPDF from "jspdf";

/** Convert an image URL to a PNG data-URL via an off-screen canvas (browser only) */
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

// 102mm x 152mm standard thermal/courier shipping label size
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
    (acc: number, i: any) => acc + (i.quantity || 1),
    0,
  );
  const recipientName = addr.fullName || order.userId?.name || "Customer";

  // Load logo
  const logoData = await toDataUrl("/logoqr.svg", 160, 160);

  // White canvas
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // Outer rounded border
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(2, 2, W - 4, H - 4, 3, 3);

  // HEADER dark bar
  doc.setFillColor(15, 15, 15);
  doc.roundedRect(2, 2, W - 4, 22, 3, 3, "F");
  doc.rect(2, 16, W - 4, 8, "F");

  // Orange left accent stripe
  doc.setFillColor(234, 88, 12);
  doc.rect(2, 2, 4, 22, "F");

  // Logo in header
  if (logoData) {
    doc.addImage(logoData, "PNG", 8, 3.5, 15, 15);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("SPICYLON", 11, 12);
  }

  // Brand text beside logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("SPICYLON", 26, 12);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text("AUTHENTIC CEYLON SPICES", 26, 18);

  // SHIPPING LABEL pill
  doc.setFillColor(234, 88, 12);
  doc.roundedRect(W - 36, 7.5, 32, 7, 2, 2, "F");
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("SHIPPING LABEL", W - 20, 12.5, { align: "center" });

  // Orange accent line below header
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.5);
  doc.line(2, 24, W - 2, 24);

  // Dashed separator helper
  const dashedLine = (y: number) => {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.25);
    const dashLen = 2,
      gap = 1.5;
    for (let x = 4; x < W - 4; x += dashLen + gap) {
      doc.line(x, y, Math.min(x + dashLen, W - 4), y);
    }
  };

  // FROM section
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(4, 27, 14, 5, 1.5, 1.5, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("FROM", 11, 30.8, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Spicylon - Ceylon Spice Trading Co.", 4, 39);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Highland Farms District, Sri Lanka", 4, 45);
  doc.text("support@spicylon.com", 4, 50);

  dashedLine(54);

  // TO section
  doc.setFillColor(15, 15, 15);
  doc.roundedRect(4, 57, 22, 5.5, 1.5, 1.5, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DELIVER TO", 15, 61, { align: "center" });

  // Recipient name
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  const maxNameW = W - 10;
  const nameStr = doc.splitTextToSize(recipientName, maxNameW)[0];
  doc.text(nameStr, 4, 72);

  // Orange underline
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.6);
  doc.line(4, 74, 4 + doc.getTextWidth(nameStr), 74);

  // Address lines
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);

  let addrY = 81;
  const addrLines: string[] = [];
  if (addr.address) addrLines.push(addr.address);
  if (addr.city || addr.postalCode)
    addrLines.push([addr.city, addr.postalCode].filter(Boolean).join(", "));
  if (addr.country) addrLines.push(addr.country);
  if (addr.phone) addrLines.push("\u260E  " + addr.phone);

  addrLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, W - 10);
    wrapped.forEach((l: string) => {
      doc.text(l, 4, addrY);
      addrY += 5.5;
    });
  });

  dashedLine(addrY + 3);

  // ORDER METADATA row
  const metaY = addrY + 9;

  // ORDER REF box
  const halfW = (W - 12) / 2;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(4, metaY - 5, halfW, 15, 2, 2, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("ORDER REF", 4 + halfW / 2, metaY - 1, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text("#" + shortId.slice(-8), 4 + halfW / 2, metaY + 5.5, {
    align: "center",
  });

  // DATE box
  const boxR = 4 + halfW + 4;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(boxR, metaY - 5, halfW, 15, 2, 2, "F");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(130, 130, 130);
  doc.text("DISPATCH DATE", boxR + halfW / 2, metaY - 1, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text(date, boxR + halfW / 2, metaY + 5.5, { align: "center" });

  // Pills row
  const pillY = metaY + 18;
  doc.setFillColor(234, 88, 12);
  doc.roundedRect(4, pillY, 28, 7, 2, 2, "F");
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    itemCount + " ITEM" + (itemCount !== 1 ? "S" : ""),
    18,
    pillY + 4.8,
    { align: "center" },
  );

  doc.setFillColor(245, 245, 244);
  doc.roundedRect(36, pillY, 44, 7, 2, 2, "F");
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("HANDLE WITH CARE", 58, pillY + 4.8, { align: "center" });

  dashedLine(pillY + 11);

  // BARCODE
  const bcY = pillY + 16;
  const bcH = 14;
  const bcX0 = 4;
  const bcW = W - 8;

  const barSeed = shortId + "0000000000000";
  const pattern: Array<{ w: number; dark: boolean }> = [];
  let totalW = 0;
  for (let i = 0; i < barSeed.length && totalW < bcW - 4; i++) {
    const code = barSeed.charCodeAt(i);
    const widths = [
      code % 3 === 0 ? 1.4 : 0.7,
      0.4,
      code % 2 === 0 ? 1.2 : 0.6,
      0.4,
      code % 5 < 2 ? 1.0 : 0.6,
    ];
    widths.forEach((w, j) => {
      pattern.push({ w, dark: j % 2 === 0 });
      totalW += w + 0.3;
    });
  }

  let bx = bcX0 + 1;
  pattern.forEach(({ w, dark }) => {
    if (bx + w > bcX0 + bcW - 1) return;
    if (dark) {
      doc.setFillColor(10, 10, 10);
      doc.rect(bx, bcY, w, bcH, "F");
    }
    bx += w + 0.3;
  });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(shortId, W / 2, bcY + bcH + 5, { align: "center" });

  // FOOTER dark bar
  doc.setFillColor(15, 15, 15);
  doc.roundedRect(2, H - 13, W - 4, 11, 3, 3, "F");
  doc.rect(2, H - 13, W - 4, 5, "F");
  doc.setFillColor(234, 88, 12);
  doc.rect(2, H - 13, 4, 11, "F");

  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text("spicylon.com  Authentic Ceylon Spices  Est. 2026", W / 2, H - 7, {
    align: "center",
  });
  doc.setFontSize(5);
  doc.setTextColor(100, 100, 100);
  doc.text("Keep dry  Fragile contents", W / 2, H - 3.5, { align: "center" });

  // Print in new window
  doc.autoPrint();
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    doc.save("ShippingLabel_" + shortId + ".pdf");
  }
};
