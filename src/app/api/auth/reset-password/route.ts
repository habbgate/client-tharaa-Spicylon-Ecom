import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp, newPassword } = await req.json();
    const normalizedEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: 'Invalid or incorrect OTP' }, { status: 400 });
    }

    if (new Date() > new Date(user.resetOtpExpires)) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    user.password = await hashPassword(newPassword);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
