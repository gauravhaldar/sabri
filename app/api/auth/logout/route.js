import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST(request) {
  try {
    const result = await logout();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Logout successful",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during logout",
      },
      { status: 500 }
    );
  }
}
