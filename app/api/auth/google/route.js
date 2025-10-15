import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/middleware/auth";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Google token is required",
        },
        { status: 400 }
      );
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not provided by Google",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      const nameParts = name ? name.split(" ") : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = new User({
        firstName,
        lastName: lastName || undefined, // Don't set empty string, let it be undefined
        email,
        phone: undefined, // No phone required for OAuth users
        googleId,
        profilePicture: picture,
        registeredBy: "google",
        isEmailVerified: true,
        isActive: true,
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.profilePicture = picture;
      user.isEmailVerified = true;
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Google login successful",
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
        token: jwtToken,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("authToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during Google login",
      },
      { status: 500 }
    );
  }
}
