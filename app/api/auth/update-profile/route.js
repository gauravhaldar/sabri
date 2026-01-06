import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function PUT(request) {
    try {
        await connectDB();

        // Get token from cookies or Authorization header
        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("authToken")?.value;
        const token = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify token and get user ID
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { firstName, lastName, phone, gender, dateOfBirth, profilePicture } = await request.json();

        // Find user and update (token uses 'id' field)
        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Update fields if provided
        if (firstName) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (gender !== undefined) user.gender = gender;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();

        // Return updated user data
        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
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
                    lastLogin: user.lastLogin,
                    tier: user.tier,
                    profilePicture: user.profilePicture,
                },
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update profile" },
            { status: 500 }
        );
    }
}
