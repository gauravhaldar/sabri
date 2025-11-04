import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Policy from "@/lib/models/Policy";

// Public GET: /api/policies/[key]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { key } = await params;
    const normalizedKey = String(key).trim().toLowerCase();
    const policy = await Policy.findOne({ key: normalizedKey }).lean();
    if (!policy) {
      return NextResponse.json(
        { success: false, message: "Policy not found" },
        { status: 404 }
      );
    }
    // Only expose the fields needed on the storefront
    return NextResponse.json({
      success: true,
      data: { key: policy.key, title: policy.title, content: policy.content },
    });
  } catch (error) {
    console.error("Frontend get policy error:", error);
    return NextResponse.json(
      { success: false, message: "Server error fetching policy" },
      { status: 500 }
    );
  }
}


