import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    console.log("Fetching necklaces from database...");

    const products = await Product.find({
      isActive: true,
      category: "necklaces",
    })
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} necklaces in database`);

    return NextResponse.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching necklaces:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching necklaces",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
