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

    const { uid, email, displayName, photoURL } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      const nameParts = displayName ? displayName.split(" ") : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = new User({
        firstName,
        lastName: lastName || undefined, // Don't set empty string, let it be undefined
        email,
        phone: undefined, // No phone required for OAuth users
        googleId: uid,
        profilePicture: photoURL,
        registeredBy: "firebase",
        isEmailVerified: true,
        isActive: true,
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Firebase Google account to existing user
      user.googleId = uid;
      user.profilePicture = photoURL;
      user.isEmailVerified = true;
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Firebase Google login successful",
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
    console.error("Firebase Google login error:", error);
    return NextResponse.json(
      { success: false, message: "Google authentication failed" },
      { status: 500 }
    );
  }
}
