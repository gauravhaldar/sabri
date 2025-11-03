import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";

export async function PATCH(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!id)
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 }
      );

    const body = await _req.json();
    const { status } = body || {};
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updated = await Review.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      data: { review: { id: updated._id.toString(), status: updated.status } },
    });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review" },
      { status: 500 }
    );
  }
}
