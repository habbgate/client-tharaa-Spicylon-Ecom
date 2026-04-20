import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { sendEmailBackground } from '@/lib/sendEmail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();
    const normalizedEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return 200 to prevent email enumeration
      return NextResponse.json({ message: 'If an account with that email exists, an OTP has been sent.' }, { status: 200 });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = resetOtp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    sendEmailBackground(
      normalizedEmail,
      'Password Reset - Spicylon',
      `<h1>Password Reset</h1><p>You requested a password reset. Your OTP is: <strong>${resetOtp}</strong>.</p><p>If you did not request this, please ignore this email.</p>`
    );

    return NextResponse.json({ message: 'If an account with that email exists, an OTP has been sent.' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
