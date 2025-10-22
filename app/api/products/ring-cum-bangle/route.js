import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
      category: "fine-gold",
    })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching ring cum bangle products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching ring cum bangle products",
      },
      { status: 500 }
    );
  }
}