import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

// GET /api/coupons - Get all coupons
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "all";

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (status === "active") {
      query.isActive = true;
      query.$expr = { $lt: ["$usedCount", "$usageLimit"] };
      // Also check if coupon has started and not expired
      query.$and = [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: new Date() } },
          ],
        },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: { $gte: new Date() } },
          ],
        },
      ];
    } else if (status === "expired") {
      query.$or = [
        { isActive: false },
        { $expr: { $gte: ["$usedCount", "$usageLimit"] } },
        { expiryDate: { $lt: new Date() } },
      ];
    } else if (status === "scheduled") {
      // New status for coupons that haven't started yet
      query.startDate = { $gt: new Date() };
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coupon.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Create new coupon
export async function POST(request) {
  try {
    await connectDB();

    const {
      name,
      code,
      type,
      amount,
      minValue,
      maxValue,
      usageLimit,
      startDate,
      expiryDate,
    } = await request.json();

    if (
      !name ||
      !code ||
      !type ||
      !amount ||
      !minValue ||
      !maxValue ||
      !usageLimit
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
        },
        { status: 400 }
      );
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code already exists",
        },
        { status: 400 }
      );
    }

    if (minValue >= maxValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum value must be greater than minimum value",
        },
        { status: 400 }
      );
    }

    // Validate start and expiry dates
    if (
      startDate &&
      startDate.trim() !== "" &&
      expiryDate &&
      expiryDate.trim() !== ""
    ) {
      const start = new Date(startDate);
      const expiry = new Date(expiryDate);
      if (start >= expiry) {
        return NextResponse.json(
          {
            success: false,
            message: "Start date must be before expiry date",
          },
          { status: 400 }
        );
      }
    }

    // Create coupon object
    const couponData = {
      name,
      code: code.toUpperCase(),
      type,
      amount,
      minValue,
      maxValue,
      usageLimit,
    };

    // Add dates only if they have values
    if (startDate && startDate.trim() !== "") {
      couponData.startDate = new Date(startDate);
    }

    if (expiryDate && expiryDate.trim() !== "") {
      couponData.expiryDate = new Date(expiryDate);
    }

    const newCoupon = new Coupon(couponData);
    const savedCoupon = await newCoupon.save();

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully",
        data: savedCoupon,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
