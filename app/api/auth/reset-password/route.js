import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();

        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { success: false, message: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find user with matching token that hasn't expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash the new password for MongoDB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user password and clear reset token in MongoDB
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Store the plain password temporarily for Firebase sync
        // This will be used by the frontend to update Firebase
        const tempResetComplete = crypto.randomBytes(32).toString("hex");
        user.tempPasswordResetComplete = tempResetComplete;

        await user.save({ validateBeforeSave: false });

        console.log("✅ MongoDB password reset successful for user:", user.email);

        return NextResponse.json({
            success: true,
            message: "Password reset successful",
            data: {
                email: user.email,
                syncToken: tempResetComplete,
            }
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to reset password. Please try again." },
            { status: 500 }
        );
    }
}
