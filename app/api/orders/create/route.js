import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Coupon from "@/lib/models/Coupon";
import Sequence from "@/lib/models/Sequence";
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
      paymentVerified = false,
      paymentDetails = null,
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

    // Generate unique order ID atomically using a sequence counter
    const nextSeq = await Sequence.findOneAndUpdate(
      { name: "orderId" },
      { $inc: { value: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const seqValue = nextSeq.value;
    const orderId = `SAB${String(seqValue).padStart(6, "0")}`;

    // Generate unique invoice ID based on sequence
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
          paymentMethod === "online_payment" && paymentVerified
            ? "paid"
            : "pending",
      },
    });

    // If payment is already verified (online flow), mark order confirmed and attach payment details
    if (paymentMethod === "online_payment" && paymentVerified) {
      order.status = "confirmed";
      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
      }
    }

    // Save with a lightweight retry in case of a rare race/dup
    let saved = false;
    let attempts = 0;
    while (!saved && attempts < 3) {
      try {
        await order.save();
        saved = true;
      } catch (e) {
        attempts++;
        // If duplicate key on orderId, bump sequence and retry
        if (e?.code === 11000 && e?.keyPattern?.orderId) {
          const retrySeq = await Sequence.findOneAndUpdate(
            { name: "orderId" },
            { $inc: { value: 1 } },
            { upsert: true, new: true }
          );
          const newVal = retrySeq.value;
          const newOrderId = `SAB${String(newVal).padStart(6, "0")}`;
          order.orderId = newOrderId;
          order.invoice.invoiceId = `INV-${newOrderId}-${Date.now()}`;
          continue;
        }
        throw e;
      }
    }

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
      paymentDetails: order.paymentDetails || undefined,
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
