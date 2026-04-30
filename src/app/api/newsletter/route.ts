import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { NewsletterSubscriber, User } from "@/models";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getRequestingUser(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("role").lean();
    return user as { role: string } | null;
  } catch {
    return null;
  }
}

// POST /api/newsletter — subscribe an email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 },
      );
    }
    await dbConnect();
    const exists = await NewsletterSubscriber.findOne({
      email: email.toLowerCase().trim(),
    });
    if (exists) {
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 409 },
      );
    }
    await NewsletterSubscriber.create({ email: email.toLowerCase().trim() });
    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("[newsletter POST]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// GET /api/newsletter — list all subscribers (admin only)
export async function GET(req: NextRequest) {
  try {
    const user = await getRequestingUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await dbConnect();
    const subscribers = await NewsletterSubscriber.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(subscribers);
  } catch (err: any) {
    console.error("[newsletter GET]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
