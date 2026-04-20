import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Setting } from '@/models';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const settings = await Setting.find({});
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { key, value } = body;

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return NextResponse.json(setting);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
