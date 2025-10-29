import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";

export async function POST(request) {
  try {
    await connectDB();
    const { userId, productId, orderId, rating, comment } = await request.json();

    if (!userId || !productId || !orderId || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const created = await Review.create({
      user: userId,
      product: productId,
      orderId,
      rating: Number(rating),
      comment: comment || "",
    });

    // Update product averageRating (simple recompute from all reviews of product)
    try {
      const agg = await Review.aggregate([
        { $match: { product: created.product } },
        { $group: { _id: "$product", avg: { $avg: "$rating" } } },
      ]);
      if (agg?.[0]) {
        await Product.findByIdAndUpdate(created.product, {
          averageRating: Math.round(agg[0].avg * 10) / 10,
        });
      }
    } catch (_) {}

    return NextResponse.json({ success: true, data: { review: created } });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this item." },
        { status: 409 }
      );
    }
    console.error("Create review error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}


