import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    // Admin only check should be here (simplified for now or via middleware)
    try {
      await dbConnect();
      const body = await req.json();
      const product = await Product.create(body);
      return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
