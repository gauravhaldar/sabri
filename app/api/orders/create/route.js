import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Coupon from "@/lib/models/Coupon";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      orderSummary,
      notes,
      userId,
    } = await request.json();

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, message: "Order items are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method is required" },
        { status: 400 }
      );
    }

    if (!orderSummary) {
      return NextResponse.json(
        { success: false, message: "Order summary is required" },
        { status: 400 }
      );
    }

    await connectDB();

    console.log("=== ORDER CREATION DEBUG ===");
    console.log("Received userId:", userId);
    console.log("UserId type:", typeof userId);
    console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));

    // Generate unique order ID
    const orderCount = await Order.countDocuments();
    const orderId = `SAB${String(orderCount + 1).padStart(6, "0")}`;

    // Generate unique invoice ID
    const invoiceId = `INV-${orderId}-${Date.now()}`;

    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create order
    const order = new Order({
      orderId,
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      orderSummary,
      estimatedDelivery,
      notes,
      invoice: {
        invoiceId,
        generatedDate: new Date(),
        dueDate: estimatedDelivery,
        paymentStatus:
          paymentMethod === "cash_on_delivery" ? "pending" : "pending",
      },
    });

    await order.save();

    // If a coupon was used, increment its usage count
    if (orderSummary.couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          {
            code: orderSummary.couponCode.toUpperCase(),
            isActive: true,
          },
          { $inc: { usedCount: 1 } },
          { new: true }
        );
      } catch (couponError) {
        console.error("Error updating coupon usage:", couponError);
        // Don't fail the order if coupon update fails
      }
    }

    // Return order data with proper timestamps
    const orderResponse = {
      orderId: order.orderId,
      createdAt: order.createdAt || order.orderDate,
      estimatedDelivery: order.estimatedDelivery,
      status: order.status,
      items: order.items,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      orderSummary: order.orderSummary,
      invoice: order.invoice,
    };

    console.log("Order created successfully:", {
      orderId: order.orderId,
      createdAt: orderResponse.createdAt,
      estimatedDelivery: orderResponse.estimatedDelivery,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: orderResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
