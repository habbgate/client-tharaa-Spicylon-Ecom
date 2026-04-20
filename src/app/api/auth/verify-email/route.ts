import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    if (user.verifyOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > new Date(user.verifyOtpExpires)) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    // Verify user
    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpires = undefined;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    const response = NextResponse.json(
      { message: 'Email verified successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}