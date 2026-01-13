import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Next.js 15: params must be awaited before accessing properties
    const { userId } = await params;

    console.log("🔍 BACKEND: GetCart request for user:", userId);

    // Validation
    if (!userId) {
      console.log("❌ BACKEND: Missing userId in getCart");
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
      console.log("❌ BACKEND: User not found in getCart");
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ BACKEND: User found, checking cart data...");
    const cartData = user.cartData || {};
    console.log("📦 BACKEND: Raw cart data from database:", cartData);
    console.log("📊 BACKEND: Cart items count:", Object.keys(cartData).length);

    // Get updated product details for each cart item
    const updatedCartData = {};

    for (const [cartKey, cartItem] of Object.entries(cartData)) {
      try {
        console.log(
          `🔍 BACKEND: Processing cart item [${cartKey}]:`,
          cartItem.name
        );

        // Get fresh product data
        const product = await Product.findById(cartItem.productId);

        if (product) {
          // Update cart item with fresh product data
          updatedCartData[cartKey] = {
            ...cartItem,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            images: product.images,
            category: product.category,
            inStock: product.stock > 0,
            stock: product.stock,
          };
          console.log(
            `✅ BACKEND: Updated cart item [${cartKey}] with fresh product data`
          );
        } else {
          // Product doesn't exist anymore, mark for removal
          console.log(
            `❌ BACKEND: Product ${cartItem.productId} not found, removing from cart`
          );
        }
      } catch (error) {
        console.error(
          `🚨 BACKEND: Error fetching product ${cartItem.productId}:`,
          error
        );
      }
    }

    // Update user's cart with fresh data
    if (Object.keys(updatedCartData).length !== Object.keys(cartData).length) {
      console.log("🔄 BACKEND: Cart data changed, updating database...");
      user.cartData = updatedCartData;
      await user.save();
      console.log("✅ BACKEND: Cart updated in database");
    }

    // Calculate totals
    const totalQuantity = Object.values(updatedCartData).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    const totalAmount = Object.values(updatedCartData).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const originalTotalAmount = Object.values(updatedCartData).reduce(
      (total, item) =>
        total + (item.originalPrice || item.price) * item.quantity,
      0
    );

    const responseData = {
      success: true,
      cartData: updatedCartData,
      cartCount: Object.keys(updatedCartData).length,
      totalQuantity,
      totalAmount,
      originalTotalAmount,
      savings: originalTotalAmount - totalAmount,
    };

    console.log("📤 BACKEND: Sending cart response:");
    console.log("   - Cart count:", responseData.cartCount);
    console.log("   - Total quantity:", responseData.totalQuantity);
    console.log("   - Total amount:", responseData.totalAmount);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("🚨 BACKEND: Get cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get cart data",
      },
      { status: 500 }
    );
  }
}
