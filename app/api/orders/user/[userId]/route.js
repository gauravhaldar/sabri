import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .select(
        "orderId createdAt status items shippingAddress paymentMethod orderSummary invoice"
      )
      .lean();

    return NextResponse.json({ success: true, data: { orders } });
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}


