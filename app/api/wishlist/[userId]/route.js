import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = params;

    console.log("🔍 BACKEND: GetWishlist request for user:", userId);

    // Validation
    if (!userId) {
      console.log("❌ BACKEND: Missing userId in getWishlist");
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Find user
    console.log("🔍 BACKEND: Looking up user in database...");
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ BACKEND: User not found in getWishlist");
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ BACKEND: User found, checking wishlist data...");
    const wishlistData = user.wishlistData || {};
    console.log("📦 BACKEND: Raw wishlist data from database:", wishlistData);
    console.log(
      "📊 BACKEND: Wishlist items count:",
      Object.keys(wishlistData).length
    );

    // Get updated product details for each wishlist item
    const updatedWishlistData = {};

    for (const [productId, wishlistItem] of Object.entries(wishlistData)) {
      try {
        console.log(
          `🔍 BACKEND: Processing wishlist item [${productId}]:`,
          wishlistItem.name
        );

        // Get fresh product data
        const product = await Product.findById(productId);

        if (product) {
          // Update wishlist item with fresh product data
          updatedWishlistData[productId] = {
            ...wishlistItem,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            images: product.images,
            category: product.category,
            inStock: product.stock > 0,
            stock: product.stock,
          };
          console.log(
            `✅ BACKEND: Updated wishlist item [${productId}] with fresh product data`
          );
        } else {
          // Product doesn't exist anymore, mark for removal
          console.log(
            `❌ BACKEND: Product ${productId} not found, removing from wishlist`
          );
        }
      } catch (error) {
        console.error(
          `🚨 BACKEND: Error fetching product ${productId}:`,
          error
        );
      }
    }

    // Update user's wishlist with fresh data
    if (
      Object.keys(updatedWishlistData).length !==
      Object.keys(wishlistData).length
    ) {
      console.log("🔄 BACKEND: Wishlist data changed, updating database...");
      user.wishlistData = updatedWishlistData;
      await user.save();
      console.log("✅ BACKEND: Wishlist updated in database");
    }

    const responseData = {
      success: true,
      wishlistData: updatedWishlistData,
      wishlistCount: Object.keys(updatedWishlistData).length,
    };

    console.log("📤 BACKEND: Sending wishlist response:");
    console.log("   - Wishlist count:", responseData.wishlistCount);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("🚨 BACKEND: Get wishlist error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get wishlist data",
      },
      { status: 500 }
    );
  }
}
