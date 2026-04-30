import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Order, User } from "@/models";
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

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const order = await Order.create({
      ...body,
      isPaid: false,
      isDelivered: false,
    });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await req.json();
    await dbConnect();
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted." });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
