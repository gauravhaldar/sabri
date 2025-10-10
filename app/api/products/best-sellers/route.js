import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
      isBestSeller: true,
    })
      .sort({ purchaseCount: -1, createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching best sellers",
      },
      { status: 500 }
    );
  }
}
