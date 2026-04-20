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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    sendEmailBackground(
      normalizedEmail,
      'Verify your Spicylon Account',
      `<h1>Welcome to Spicylon!</h1><p>Your new verification code is: <strong>${otp}</strong>.</p><p>This code expires in 15 minutes.</p>`
    );

    return NextResponse.json({ message: 'OTP resent successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
