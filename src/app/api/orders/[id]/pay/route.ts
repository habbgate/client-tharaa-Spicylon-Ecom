import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
