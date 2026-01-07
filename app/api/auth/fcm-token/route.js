import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        const { token, userId } = await request.json();

        // Validate required fields
        if (!token) {
            return NextResponse.json(
                { success: false, message: "FCM token is required" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID format" },
                { status: 400 }
            );
        }

        await connectDB();

        // Update user's FCM token
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fcmToken: token },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        console.log(`✅ FCM token saved for user ${userId}`);

        return NextResponse.json(
            {
                success: true,
                message: "FCM token saved successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving FCM token:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to save FCM token",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
