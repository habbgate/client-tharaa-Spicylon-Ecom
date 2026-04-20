import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, Order } from '@/models';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sendEmailBackground } from '@/lib/sendEmail';

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'spicylon-super-secret-jwt-key-change-in-production')
    );

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Capture email before deleting
    const userEmail = user.email;
    const userName = user.name;

    // Prevent admin deletion for safety unless specifically coded
    if (user.role === 'admin') {
      return NextResponse.json({ message: 'Admin accounts cannot be deleted directly.' }, { status: 403 });
    }

    // Wipe orders associated with the user for privacy (or anonymize)
    // Here we'll anonymize them to keep financial records
    await Order.updateMany({ userId: user._id }, { $unset: { userId: 1 }, $set: { "shippingAddress.fullName": "Deleted User" } });

    await user.deleteOne();

    cookieStore.delete('token');

    // Send final goodbye email
    sendEmailBackground(
      userEmail,
      'Your Spicylon Account Has Been Deleted',
      `<h1>Farewell, ${userName}</h1><p>Your Spicylon account has been successfully deleted.</p><p>We hope to see you back on the Spice Route in the future!</p>`
    );

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
