import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function DELETE(request) {
  try {
    await connectDB();

    const { userId, cartKey } = await request.json();

    console.log("🗑️ BACKEND: RemoveFromCart request received");
    console.log("📝 Request data:", { userId, cartKey });

    // Validation
    if (!userId || !cartKey) {
      console.log("❌ BACKEND: Validation failed - missing userId or cartKey");
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Cart Key are required",
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
      "✅ BACKEND: User found, removing item with cart key:",
      cartKey
    );

    // Remove item from cart
    if (user.cartData && user.cartData[cartKey]) {
      const itemName = user.cartData[cartKey].name;
      delete user.cartData[cartKey];

      console.log(`🗑️ BACKEND: Removed item: ${itemName}`);

      // IMPORTANT: Mark the cartData field as modified for Mongoose
      user.markModified("cartData");
      console.log("🔧 BACKEND: Marked cartData as modified");

      await user.save();
      console.log("✅ BACKEND: Item removal saved to database");

      return NextResponse.json({
        success: true,
        message: "Item removed from cart successfully",
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
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove item from cart",
      },
      { status: 500 }
    );
  }
}
