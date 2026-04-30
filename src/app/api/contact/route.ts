import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactMessage, User } from "@/models";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getAdminUser() {
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

// POST /api/contact — save a contact form submission
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 },
      );
    }
    await dbConnect();
    await ContactMessage.create({
      name: name.trim(),
      email,
      subject: subject?.trim() || "",
      message: message.trim(),
    });
    return NextResponse.json(
      { message: "Message received. We'll get back to you soon!" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// GET /api/contact — admin only, returns all messages
export async function GET() {
  try {
    const user = await getAdminUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    await dbConnect();
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

// PATCH /api/contact — mark message as read
export async function PATCH(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await req.json();
    await dbConnect();
    await ContactMessage.findByIdAndUpdate(id, { isRead: true });
    return NextResponse.json({ message: "Marked as read." });
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
