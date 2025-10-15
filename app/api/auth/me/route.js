import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { authenticateToken } from "@/lib/middleware/auth";

export async function GET(request) {
  try {
    // Check if required environment variables are set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    await connectDB();

    // Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const token = authHeader
      ? authHeader.split(" ")[1]
      : request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Access token required",
        },
        { status: 401 }
      );
    }

    // Verify token and get user
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is deactivated",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          tier: user.tier,
          profilePicture: user.profilePicture,
          addresses: user.addresses,
          preferences: user.preferences,
          stats: user.stats,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          success: false,
          message: "Token expired",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
