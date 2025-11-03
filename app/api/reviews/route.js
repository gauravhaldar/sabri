import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";

export async function POST(request) {
  try {
    await connectDB();
    const { userId, productId, orderId, rating, comment } =
      await request.json();

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
      // status defaults to 'pending' via schema
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

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "9", 10), 50);

    const filter = {};
    if (status) filter.status = status;

    const docs = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "user", select: "firstName lastName" })
      .populate({ path: "product", select: "name images" });

    // Normalize to UI-friendly shape
    const items = docs.map((r) => ({
      id: r._id.toString(),
      userName:
        r.user && r.user.firstName && r.user.lastName
          ? `${r.user.firstName} ${r.user.lastName}`.trim()
          : r.user?.firstName || r.user?.lastName || "Anonymous",
      rating: r.rating,
      text: r.comment || "",
      productName: r.product?.name || "",
      productImage:
        Array.isArray(r.product?.images) && r.product.images[0]
          ? r.product.images[0]
          : "",
      createdAt: r.createdAt,
      status: r.status,
    }));

    return NextResponse.json({ success: true, data: { reviews: items } });
  } catch (error) {
    console.error("List reviews error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
