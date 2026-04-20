import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import { signToken, hashPassword } from '@/lib/auth';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ message: 'Invalid Google Token' }, { status: 401 });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || 'Google User';

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      const randomPassword = crypto.randomBytes(20).toString('hex');
      const hashedPassword = await hashPassword(randomPassword);
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'customer'
      });
      await user.save();
    }

    const authToken = signToken({ id: user._id, role: user.role });

    const response = NextResponse.json(
      { message: 'Google Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address } },
      { status: 200 }
    );

    response.cookies.set('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}