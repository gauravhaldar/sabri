import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const product = await Product.findOne({
      slug: slug,
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, {
      $inc: { viewCount: 1 },
    });

    return NextResponse.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
