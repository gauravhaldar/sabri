import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/middleware/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { firstName, lastName, email, password, phone, gender, dateOfBirth } =
      await request.json();

    // Validate input - only email and password are required
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
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

    // Create new user
    const user = new User({
      firstName: firstName || "User",
      lastName: lastName || undefined,
      email,
      password,
      phone: phone || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      registeredBy: "website",
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "User registered successfully",
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
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration",
      },
      { status: 500 }
    );
  }
}
