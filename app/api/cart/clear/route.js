import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function DELETE(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    console.log("🧹 BACKEND: ClearCart request received");
    console.log("📝 Request data:", { userId });

    // Validation
    if (!userId) {
      console.log("❌ BACKEND: Missing userId in clearCart");
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Find user
    console.log("🔍 BACKEND: Looking up user:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ BACKEND: User not found");
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ BACKEND: User found, clearing cart");

    // Clear cart
    user.cartData = {};

    // IMPORTANT: Mark the cartData field as modified for Mongoose
    user.markModified("cartData");
    console.log("🔧 BACKEND: Marked cartData as modified");

    await user.save();
    console.log("✅ BACKEND: Cart cleared and saved to database");

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
      cartData: {},
      cartCount: 0,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cart",
      },
      { status: 500 }
    );
  }
}
