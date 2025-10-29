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

    console.log("Backend: Connecting to DB...");
    await connectDB();
    console.log("Backend: Connected to DB.");

    const { uid, phoneNumber, displayName, photoURL } = await request.json();
    console.log("Backend: Received data - UID:", uid, ", Phone:", phoneNumber);

    if (!uid || !phoneNumber) {
      console.log("Backend: Missing required fields");
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const fallbackEmail = `${uid}@phone.firebase.local`;
    console.log("Backend: Fallback email generated:", fallbackEmail);

    console.log("Backend: Searching for user by phone or email...");
    let user = await User.findOne({ $or: [{ phone: phoneNumber }, { email: fallbackEmail }] });
    console.log("Backend: User search result:", user ? "Found" : "Not found");

    if (!user) {
      console.log("Backend: User not found, creating new user...");
      const nameParts = displayName ? displayName.split(" ") : ["User"];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      user = new User({
        firstName,
        lastName: lastName || undefined,
        email: fallbackEmail,
        phone: phoneNumber,
        firebaseUid: uid, // Use a dedicated field for firebase UIDs
        profilePicture: photoURL,
        registeredBy: "firebase",
        isEmailVerified: false, // Phone users might not have verified emails initially
        isActive: true,
      });
      await user.save();
      console.log("Backend: New user created.", user._id);
    } else {
      console.log("Backend: User found, checking for updates...");
      let updated = false;
      if (!user.phoneNumber) { // Check if phone number is missing
        user.phoneNumber = phoneNumber;
        updated = true;
      }
      if (!user.firebaseUid) { // Set firebaseUid if missing
        user.firebaseUid = uid;
        updated = true;
      }
      if (!user.profilePicture && photoURL) { // Update profile picture if available
        user.profilePicture = photoURL;
        updated = true;
      }
      if (updated) {
        await user.save();
        console.log("Backend: Existing user updated.");
      } else {
        console.log("Backend: No updates needed for existing user.");
      }
    }

    console.log("Backend: Updating last login...");
    user.lastLogin = new Date();
    await user.save();
    console.log("Backend: Last login updated.");

    console.log("Backend: Generating JWT token...");
    const token = generateToken(user._id);
    console.log("Backend: JWT token generated.");

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

    console.log("Backend: Setting auth cookie...");
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("Backend: Auth cookie set.");

    return response;
  } catch (error) {
    console.error("Firebase phone login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}


