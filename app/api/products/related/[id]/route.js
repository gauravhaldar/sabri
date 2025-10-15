import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // First, get the current product to find its category
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Find related products from the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: currentProduct.category,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(8);

    return NextResponse.json({
      success: true,
      data: {
        products: relatedProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching related products",
      },
      { status: 500 }
    );
  }
}
