import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { hashPassword } from '@/lib/auth';
import { sendEmailBackground } from '@/lib/sendEmail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const normalizedEmail = email.toLowerCase();
    let existingUser = await User.findOne({ email: normalizedEmail });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await hashPassword(password);
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      } else {
        existingUser.verifyOtp = otp;
        existingUser.verifyOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
        existingUser.password = hashedPassword;
        existingUser.name = name;
        await existingUser.save();
      }
    } else {
      existingUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        verifyOtp: otp,
        verifyOtpExpires: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    sendEmailBackground(
      normalizedEmail,
      'Verify your Spicylon Account',
      `<h1>Welcome to Spicylon, ${name}!</h1><p>Your verification code is: <strong>${otp}</strong>.</p><p>This code expires in 15 minutes.</p>`
    );

    return NextResponse.json(
      { message: 'OTP sent for verification', requiresVerification: true, email: normalizedEmail },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

