import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(234, 88, 12); // Tailwind orange-600
  doc.text('SPICYLON', 14, 25);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Authentic Ceylon Spices', 14, 32);

  // Invoice Details
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text('INVOICE', 140, 25);
  doc.setFontSize(10);
  doc.text(`Order ID: ${order._id}`, 140, 32);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 38);
  doc.text(`Status: ${order.isPaid ? 'PAID' : 'PENDING'}`, 140, 44);
  doc.text(`Payment Method: ${order.paymentMethod || 'Stripe'}`, 140, 50);

  // Divider
  doc.setDrawColor(200);
  doc.line(14, 55, 196, 55);

  // Addresses
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text('Billed To / Shipped To:', 14, 65);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  const addr = order.shippingAddress || {};
  doc.text(addr.fullName || order.user?.name || 'Customer', 14, 75);
  doc.text(addr.address || '', 14, 81);
  doc.text(`${addr.city || ''}, ${addr.postalCode || ''}`, 14, 87);
  doc.text(addr.country || '', 14, 93);
  doc.text(`Phone: ${addr.phone || ''}`, 14, 99);

  // Spacing before table
  let startY = 110;

  autoTable(doc, {
    startY,
    headStyles: { fillColor: [234, 88, 12] },
    head: [['Item', 'Qty', 'Unit Price', 'Total']],
    body: order.orderItems.map((item: any) => [
      item.name,
      item.quantity,
      `${order.currency || 'USD'} ${item.price.toFixed(2)}`,
      `${order.currency || 'USD'} ${(item.quantity * item.price).toFixed(2)}`
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(10);
  doc.setTextColor(40);
  
  const subtotal = order.orderItems.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
  const shippingPrice = order.shippingPrice || 0;
  const taxPrice = order.taxPrice || 0;
  const totalPrice = order.totalPrice || 0;

  doc.text('Subtotal:', 140, finalY);
  doc.text(`${order.currency || 'USD'} ${subtotal.toFixed(2)}`, 170, finalY);

  doc.text('Shipping:', 140, finalY + 8);
  doc.text(`${order.currency || 'USD'} ${shippingPrice.toFixed(2)}`, 170, finalY + 8);

  if (taxPrice > 0) {
    doc.text('Tax:', 140, finalY + 16);
    doc.text(`${order.currency || 'USD'} ${taxPrice.toFixed(2)}`, 170, finalY + 16);
  }

  const grandY = taxPrice > 0 ? finalY + 26 : finalY + 18;
  doc.setFontSize(12);
  doc.setTextColor(234, 88, 12);
  doc.text('Total:', 140, grandY);
  doc.text(`${order.currency || 'USD'} ${totalPrice.toFixed(2)}`, 170, grandY);

  // Footer Message
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Thank you for shopping with Spicylon!', 105, 280, { align: 'center' });

  doc.save(`Invoice_Spicylon_${order._id.slice(-8)}.pdf`);
};