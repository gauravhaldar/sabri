import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/middleware/auth";

export async function POST(request) {
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

    const { uid, email, firstName, lastName, phone, gender, dateOfBirth } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 400 }
      );
    }

    // Create new user in MongoDB
    const user = new User({
      firstName: firstName || "User",
      lastName: lastName || undefined,
      email,
      phone: phone || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      googleId: uid, // Using Firebase UID as googleId for consistency
      registeredBy: "firebase",
      isEmailVerified: true,
      isActive: true,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Firebase registration successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          tier: user.tier,
          profilePicture: user.profilePicture,
        },
        token,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Firebase registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
