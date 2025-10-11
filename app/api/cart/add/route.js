import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function POST(request) {
  try {
    await connectDB();

    const {
      userId,
      productId,
      quantity = 1,
      size = null,
      color = null,
    } = await request.json();

    console.log("🚀 BACKEND: AddToCart request received");
    console.log("📝 Request data:", {
      userId,
      productId,
      quantity,
      size,
      color,
    });

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

    // Initialize cartData if empty
    if (!user.cartData) {
      user.cartData = {};
      console.log("🔧 BACKEND: Initialized empty cart for user");
    }

    // Create unique key for product (includes size and color if provided)
    const cartKey =
      size || color
        ? `${productId}_${size || "default"}_${color || "default"}`
        : productId;

    console.log("🔑 BACKEND: Generated cart key:", cartKey);
    console.log(
      "🔍 BACKEND: Current cart data before modification:",
      JSON.stringify(user.cartData, null, 2)
    );

    // Add or update cart item with product details
    if (user.cartData[cartKey]) {
      // Item exists, update quantity only
      const oldQuantity = user.cartData[cartKey].quantity;
      user.cartData[cartKey].quantity += parseInt(quantity);
      user.cartData[cartKey].updatedAt = new Date();
      console.log(
        `🔄 BACKEND: Updated existing item quantity: ${oldQuantity} -> ${user.cartData[cartKey].quantity}`
      );
    } else {
      // New item, add to cart with full product details
      user.cartData[cartKey] = {
        productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images, // Store all product images
        category: product.category,
        quantity: parseInt(quantity),
        size: size || null,
        color: color || null,
        addedAt: new Date(),
      };
      console.log("➕ BACKEND: Added new item to cart:", product.name);
    }

    // IMPORTANT: Mark the cartData field as modified for Mongoose
    user.markModified("cartData");
    console.log("🔧 BACKEND: Marked cartData as modified for Mongoose");
    console.log(
      "🔍 BACKEND: Cart data after modification:",
      JSON.stringify(user.cartData, null, 2)
    );

    // Save updated cart to database
    console.log("💾 BACKEND: Saving cart to database...");
    console.log(
      "🔍 BACKEND: Cart data before save:",
      JSON.stringify(user.cartData, null, 2)
    );

    const saveResult = await user.save();
    console.log("✅ BACKEND: Cart saved successfully to database");
    console.log("🔍 BACKEND: Save result:", saveResult ? "Success" : "Failed");

    // Verify the save by re-fetching the user
    const verifyUser = await User.findById(userId);
    console.log(
      "🔍 BACKEND: Verification - Cart data after save:",
      JSON.stringify(verifyUser.cartData, null, 2)
    );

    const cartCount = Object.keys(user.cartData).length;
    const verifyCartCount = Object.keys(verifyUser.cartData).length;
    console.log("📊 BACKEND: Cart summary - Items (before save):", cartCount);
    console.log(
      "📊 BACKEND: Cart summary - Items (after save verification):",
      verifyCartCount
    );
    console.log(
      "📦 BACKEND: Cart contents (before save):",
      Object.keys(user.cartData)
    );
    console.log(
      "📦 BACKEND: Cart contents (after save verification):",
      Object.keys(verifyUser.cartData)
    );

    const response = {
      success: true,
      message: "Item added to cart successfully",
      cartData: user.cartData,
      cartCount: cartCount,
    };

    console.log("📤 BACKEND: Sending response to frontend");
    return NextResponse.json(response);
  } catch (error) {
    console.error("🚨 BACKEND: Add to cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add item to cart",
      },
      { status: 500 }
    );
  }
}
