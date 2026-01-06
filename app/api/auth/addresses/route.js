import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

// GET - Fetch user addresses
export async function GET(request) {
    try {
        await connectDB();

        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("authToken")?.value;
        const token = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const user = await User.findById(decoded.id).select("addresses");
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { addresses: user.addresses || [] },
        });
    } catch (error) {
        console.error("Get addresses error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}

// POST - Add new address
export async function POST(request) {
    try {
        await connectDB();

        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("authToken")?.value;
        const token = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const addressData = await request.json();

        // Validate required fields
        const requiredFields = ["name", "phone", "address", "city", "state", "pincode"];
        for (const field of requiredFields) {
            if (!addressData[field]) {
                return NextResponse.json(
                    { success: false, message: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // If this is the first address or marked as default, set as default
        if (!user.addresses || user.addresses.length === 0 || addressData.isDefault) {
            // Reset all other addresses' isDefault to false
            if (user.addresses) {
                user.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
            }
            addressData.isDefault = true;
        }

        // Add new address
        user.addresses = user.addresses || [];
        user.addresses.push(addressData);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            data: { addresses: user.addresses },
        });
    } catch (error) {
        console.error("Add address error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to add address" },
            { status: 500 }
        );
    }
}

// PUT - Update address
export async function PUT(request) {
    try {
        await connectDB();

        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("authToken")?.value;
        const token = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { addressId, ...addressData } = await request.json();

        if (!addressId) {
            return NextResponse.json(
                { success: false, message: "Address ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return NextResponse.json(
                { success: false, message: "Address not found" },
                { status: 404 }
            );
        }

        // If setting as default, reset all others
        if (addressData.isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Update the address
        Object.assign(user.addresses[addressIndex], addressData);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address updated successfully",
            data: { addresses: user.addresses },
        });
    } catch (error) {
        console.error("Update address error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update address" },
            { status: 500 }
        );
    }
}

// DELETE - Delete address
export async function DELETE(request) {
    try {
        await connectDB();

        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("authToken")?.value;
        const token = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get("addressId");

        if (!addressId) {
            return NextResponse.json(
                { success: false, message: "Address ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return NextResponse.json(
                { success: false, message: "Address not found" },
                { status: 404 }
            );
        }

        // Remove the address
        user.addresses.splice(addressIndex, 1);

        // If removed address was default, set first remaining address as default
        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address deleted successfully",
            data: { addresses: user.addresses },
        });
    } catch (error) {
        console.error("Delete address error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete address" },
            { status: 500 }
        );
    }
}
