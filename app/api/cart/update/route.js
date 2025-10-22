import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export async function PUT(request) {
  try {
    await connectDB();

    const { userId, cartKey, quantity } = await request.json();

    console.log("🔄 BACKEND: UpdateCartQuantity request received");
    console.log("📝 Request data:", { userId, cartKey, quantity });

    // Validation
    if (!userId || !cartKey || quantity === undefined) {
      console.log("❌ BACKEND: Validation failed - missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "User ID, Cart Key, and Quantity are required",
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      console.log("❌ BACKEND: Invalid quantity - must be at least 1");
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be at least 1",
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

    console.log(
      "✅ BACKEND: User found, updating quantity for cart key:",
      cartKey
    );

    // Update quantity with stock enforcement
    if (user.cartData && user.cartData[cartKey]) {
      // Load product to know current stock
      const productId = user.cartData[cartKey].productId;
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      const desiredQuantity = parseInt(quantity);
      const finalQuantity = Math.min(desiredQuantity, product.stock);
      const oldQuantity = user.cartData[cartKey].quantity;

      user.cartData[cartKey].quantity = finalQuantity;
      user.cartData[cartKey].stock = product.stock; // keep stock snapshot for UI
      user.cartData[cartKey].updatedAt = new Date();

      console.log(
        `🔄 BACKEND: Updated quantity: ${oldQuantity} -> ${quantity}`
      );

      // IMPORTANT: Mark the cartData field as modified for Mongoose
      user.markModified("cartData");
      console.log("🔧 BACKEND: Marked cartData as modified");

      await user.save();
      console.log("✅ BACKEND: Quantity update saved to database");

      return NextResponse.json({
        success: true,
        message: "Cart quantity updated successfully",
        cartData: user.cartData,
        cartCount: Object.keys(user.cartData).length,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found in cart",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart quantity",
      },
      { status: 500 }
    );
  }
}
