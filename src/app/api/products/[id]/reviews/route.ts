import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { Product } from "@/models";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(product.reviews || []);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { rating, comment, userName } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { message: "Rating and comment are required" },
        { status: 400 },
      );
    }

    // Try to get logged-in user — optional
    let userId: Types.ObjectId | undefined;
    let resolvedName = "Anonymous";
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token) as any;
        if (decoded?.id) {
          userId = decoded.id;
          resolvedName = userName || decoded.name || "Anonymous";
        }
      }
    } catch {
      /* guest — ignore */
    }

    if (!userId) {
      resolvedName = "Anonymous";
    }

    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Prevent a logged-in user from reviewing the same product twice
    if (userId) {
      const alreadyReviewed = product.reviews?.find(
        (r: any) => r.userId?.toString() === userId!.toString(),
      );
      if (alreadyReviewed) {
        return NextResponse.json(
          { message: "Product already reviewed" },
          { status: 400 },
        );
      }
    }

    const review: any = {
      productId: id,
      userName: resolvedName,
      rating: Number(rating),
      comment,
    };
    if (userId) review.userId = userId;

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return NextResponse.json({ message: "Review added" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
