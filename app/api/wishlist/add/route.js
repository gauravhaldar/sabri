import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, productId } = await request.json();

    console.log("🚀 BACKEND: AddToWishlist request received");
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

    // Check if product exists
    console.log("🔍 BACKEND: Looking up product:", productId);
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ BACKEND: Product not found:", productId);
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }
    console.log("✅ BACKEND: Product found:", product.name);

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

    // Check if product is already in wishlist
    if (user.wishlistData[productId]) {
      console.log("ℹ️ BACKEND: Product already in wishlist");
      return NextResponse.json(
        {
          success: false,
          message: "Product already in wishlist",
          wishlistData: user.wishlistData,
          wishlistCount: Object.keys(user.wishlistData).length,
        },
        { status: 200 }
      );
    }

    // Add product to wishlist with full product details
    user.wishlistData[productId] = {
      productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      category: product.category,
      addedAt: new Date(),
    };
    console.log("➕ BACKEND: Added product to wishlist:", product.name);

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
      message: "Product added to wishlist successfully",
      wishlistData: user.wishlistData,
      wishlistCount: wishlistCount,
    };

    console.log("📤 BACKEND: Sending response to frontend");
    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 BACKEND: Add to wishlist error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to wishlist",
      },
      { status: 500 }
    );
  }
}
