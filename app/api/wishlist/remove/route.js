import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function DELETE(request) {
  try {
    await connectDB();

    const { userId, productId } = await request.json();

    console.log("🗑️ BACKEND: RemoveFromWishlist request received");
    console.log("📝 Request data:", { userId, productId });

    // Validation
    if (!userId || !productId) {
      console.log(
        "❌ BACKEND: Validation failed - missing userId or productId"
      );
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Product ID are required",
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

    // Initialize wishlistData if empty
    if (!user.wishlistData) {
      user.wishlistData = {};
      console.log("🔧 BACKEND: Initialized empty wishlist for user");
    }

    // Check if product exists in wishlist
    if (!user.wishlistData[productId]) {
      console.log("❌ BACKEND: Product not found in wishlist:", productId);
      return NextResponse.json(
        {
          success: false,
          message: "Product not found in wishlist",
        },
        { status: 404 }
      );
    }

    // Remove product from wishlist
    delete user.wishlistData[productId];
    console.log("➖ BACKEND: Removed product from wishlist:", productId);

    // Mark the wishlistData field as modified for Mongoose
    user.markModified("wishlistData");
    console.log("🔧 BACKEND: Marked wishlistData as modified for Mongoose");

    // Save updated wishlist to database
    console.log("💾 BACKEND: Saving wishlist to database...");
    await user.save();
    console.log("✅ BACKEND: Wishlist saved successfully to database");

    const wishlistCount = Object.keys(user.wishlistData).length;
    console.log("📊 BACKEND: Wishlist summary - Items:", wishlistCount);

    const response = {
      success: true,
      message: "Product removed from wishlist successfully",
      wishlistData: user.wishlistData,
      wishlistCount: wishlistCount,
    };

    console.log("📤 BACKEND: Sending response to frontend");
    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 BACKEND: Remove from wishlist error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product from wishlist",
      },
      { status: 500 }
    );
  }
}
