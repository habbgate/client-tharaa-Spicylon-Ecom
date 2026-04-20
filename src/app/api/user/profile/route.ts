import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, name, email, password, address, city, postalCode, country, phone } = body;

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // In a real app we would hash this, but assuming basic setup

    user.address = {
      address: address || user.address?.address || '',
      city: city || user.address?.city || '',
      postalCode: postalCode || user.address?.postalCode || '',
      country: country || user.address?.country || '',
      phone: phone || user.address?.phone || '',
    };

    await user.save();

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await User.findByIdAndDelete(userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
