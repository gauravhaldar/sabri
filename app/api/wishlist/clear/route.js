import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function DELETE(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    console.log("🧹 BACKEND: ClearWishlist request received");
    console.log("📝 Request data:", { userId });

    // Validation
    if (!userId) {
      console.log("❌ BACKEND: Validation failed - missing userId");
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
      console.log("❌ BACKEND: User not found:", userId);
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    console.log("✅ BACKEND: User found:", user.email || user._id);

    // Clear wishlist
    user.wishlistData = {};
    console.log("🧹 BACKEND: Cleared wishlist for user");

    // Mark the wishlistData field as modified for Mongoose
    user.markModified("wishlistData");
    console.log("🔧 BACKEND: Marked wishlistData as modified for Mongoose");

    // Save updated wishlist to database
    console.log("💾 BACKEND: Saving cleared wishlist to database...");
    await user.save();
    console.log("✅ BACKEND: Wishlist cleared successfully in database");

    const response = {
      success: true,
      message: "Wishlist cleared successfully",
      wishlistData: {},
      wishlistCount: 0,
    };

    console.log("📤 BACKEND: Sending response to frontend");
    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 BACKEND: Clear wishlist error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear wishlist",
      },
      { status: 500 }
    );
  }
}
