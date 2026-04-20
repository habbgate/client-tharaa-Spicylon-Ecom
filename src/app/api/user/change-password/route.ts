import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { hashPassword, comparePassword } from '@/lib/auth';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
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

    const { currentPassword, newPassword } = await req.json();
    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Google accounts don't have current passwords, what if their password hash is random?
    // We should allow them to skip current password, but to be secure, google auth probably generates random passwords.

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}