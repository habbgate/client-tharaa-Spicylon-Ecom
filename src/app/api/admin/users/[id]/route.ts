import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, Order } from '@/models';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    // Assuming admin middleware check here
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      await dbConnect();
      const { id } = await params;
      const body = await req.json();
      
      const user = await User.findById(id);
      if(!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      
      user.role = body.role || user.role;
      await user.save();
      
      return NextResponse.json({ message: 'User updated' });
    } catch (error) {
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
  }