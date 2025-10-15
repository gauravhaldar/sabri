import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

// POST /api/coupons/apply - Apply coupon
export async function POST(request) {
  try {
    await connectDB();

    const { code, orderAmount } = await request.json();

    // Validate input
    if (!code || orderAmount === undefined || orderAmount === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code and order amount are required",
        },
        { status: 400 }
      );
    }

    if (typeof orderAmount !== "number" || orderAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order amount must be a positive number",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon code",
        },
        { status: 404 }
      );
    }

    // Check if coupon has started
    if (coupon.startDate && coupon.startDate > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon is not yet active",
        },
        { status: 400 }
      );
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon has expired",
        },
        { status: 400 }
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon usage limit exceeded",
        },
        { status: 400 }
      );
    }

    if (orderAmount < coupon.minValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value should be ₹${coupon.minValue}`,
        },
        { status: 400 }
      );
    }

    if (orderAmount > coupon.maxValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum order value should be ₹${coupon.maxValue}`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.type === "flat") {
      discount = Math.min(coupon.amount, orderAmount); // Don't allow discount greater than order amount
    } else if (coupon.type === "percentage") {
      discount = Math.floor((orderAmount * coupon.amount) / 100);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon type",
        },
        { status: 400 }
      );
    }

    // Ensure discount doesn't exceed order amount
    discount = Math.min(discount, orderAmount);

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon._id,
        discount: discount,
        finalAmount: orderAmount - discount,
        couponDetails: coupon,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
