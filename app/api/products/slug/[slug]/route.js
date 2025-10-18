import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required",
        },
        { status: 400 }
      );
    }

    // Find product by slug or _id
    const product = await Product.findOne({
      $or: [{ slug: slug }, { _id: slug }, { id: slug }],
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching product",
      },
      { status: 500 }
    );
  }
}
