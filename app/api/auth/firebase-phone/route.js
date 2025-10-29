import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/middleware/auth";

export async function POST(request) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    await connectDB();

    const { uid, phoneNumber, displayName, photoURL } = await request.json();

    if (!uid || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Because our schema requires an email, synthesize a placeholder if missing
    // The placeholder is deterministic and tied to the uid to avoid duplicates
    const fallbackEmail = `${uid}@phone.firebase.local`;

    // Try to find by phone first, then by synthesized email
    let user = await User.findOne({ $or: [{ phone: phoneNumber }, { email: fallbackEmail }] });

    if (!user) {
      const nameParts = displayName ? displayName.split(" ") : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = new User({
        firstName,
        lastName: lastName || undefined,
        email: fallbackEmail,
        phone: phoneNumber,
        googleId: uid, // reuse field to store provider uid for consistency
        profilePicture: photoURL,
        registeredBy: "firebase",
        isEmailVerified: true,
        isActive: true,
      });
      await user.save();
    } else {
      // Update missing fields
      let updated = false;
      if (!user.phone) { user.phone = phoneNumber; updated = true; }
      if (!user.profilePicture && photoURL) { user.profilePicture = photoURL; updated = true; }
      if (updated) { await user.save(); }
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    const response = NextResponse.json({
      success: true,
      message: "Firebase phone login successful",
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

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response;
  } catch (error) {
    console.error("Firebase phone login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}


