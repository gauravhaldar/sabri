import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { order } });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}


