import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import Coupon from "@/lib/models/Coupon";

// PayU Configuration - All values must be set in .env.local
const PAYU_CONFIG = {
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY,
  MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT,
};

// Validate required PayU configuration
if (!PAYU_CONFIG.MERCHANT_KEY || !PAYU_CONFIG.MERCHANT_SALT) {
  console.error(
    "❌ PayU configuration missing! Please set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT in .env.local"
  );
}

/**
 * Verify hash for PayU response (Reverse Hashing)
 * Formula for regular integration: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
const verifyResponseHash = (data) => {
  const {
    status,
    firstname,
    email,
    productinfo,
    amount,
    txnid,
    key,
    hash,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    additional_charges = "",
  } = data;

  // Build hash string based on whether additional_charges is present
  let hashString;
  if (additional_charges) {
    hashString = [
      additional_charges,
      PAYU_CONFIG.MERCHANT_SALT,
      status,
      "",
      "",
      "",
      "",
      "",
      "",
      udf5,
      udf4,
      udf3,
      udf2,
      udf1,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
    ].join("|");
  } else {
    hashString = [
      PAYU_CONFIG.MERCHANT_SALT,
      status,
      "",
      "",
      "",
      "",
      "",
      "",
      udf5,
      udf4,
      udf3,
      udf2,
      udf1,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key,
    ].join("|");
  }

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  return calculatedHash === hash;
};

/**
 * PayU Webhook Handler
 * Handles server-to-server callbacks from PayU
 */
export async function POST(request) {
  try {
    // Parse form data from PayU
    const formData = await request.formData();
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log("PayU Webhook received:", {
      mihpayid: data.mihpayid,
      txnid: data.txnid,
      status: data.status,
      amount: data.amount,
    });

    // Verify hash to ensure authenticity
    const isValidHash = verifyResponseHash(data);
    if (!isValidHash) {
      console.error("Invalid hash received from PayU");
      return NextResponse.json(
        { success: false, message: "Invalid hash" },
        { status: 400 }
      );
    }

    await connectDB();

    // Extract order ID from udf1
    const orderId = data.udf1;
    if (!orderId) {
      console.error("Order ID not found in webhook data");
      return NextResponse.json(
        { success: false, message: "Order ID not found" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order based on payment status
    const paymentStatus = data.status.toLowerCase();

    order.paymentDetails = {
      ...order.paymentDetails,
      txnId: data.txnid,
      mihpayid: data.mihpayid,
      amount: parseFloat(data.amount),
      status: paymentStatus,
      gateway: "payu",
      mode: data.mode,
      bankcode: data.bankcode,
      bank_ref_no: data.bank_ref_no,
      error: data.error,
      error_Message: data.error_Message,
      updatedAt: new Date(),
      webhookData: data,
    };
    if (paymentStatus === "success") {
      order.status = "confirmed";
      order.invoice = { ...order.invoice, paymentStatus: "paid" };
      await order.save();

      // Clear server-side cart
      try {
        const userId = order.user;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            user.cartData = {};
            user.markModified("cartData");
            await user.save();
          }
        }
      } catch (e) {
        console.error("Failed to clear cart after webhook success:", e);
      }

      console.log("Order updated successfully:", {
        orderId,
        status: order.status,
        paymentStatus: order.invoice?.paymentStatus,
      });

      return NextResponse.json(
        { success: true, message: "Webhook processed successfully" },
        { status: 200 }
      );
    }

    if (
      paymentStatus === "failed" ||
      paymentStatus === "failure" ||
      paymentStatus === "cancelled" ||
      paymentStatus === "cancel"
    ) {
      // Decrement coupon usage if applicable
      try {
        const code = order.orderSummary?.couponCode;
        if (code) {
          await Coupon.findOneAndUpdate(
            { code: code.toUpperCase(), isActive: true },
            { $inc: { usedCount: -1 } },
            { new: true }
          );
        }
      } catch (couponErr) {
        console.warn(
          "Coupon decrement failed (webhook, non-fatal):",
          couponErr
        );
      }

      await Order.deleteOne({ _id: order._id });
      console.log(
        "Deleted order due to webhook failed/cancelled payment:",
        orderId
      );

      return NextResponse.json(
        {
          success: true,
          message: "Webhook processed: order removed after failure/cancel",
        },
        { status: 200 }
      );
    }

    if (paymentStatus === "pending") {
      order.status = "pending";
      order.invoice = { ...order.invoice, paymentStatus: "pending" };
      await order.save();
      return NextResponse.json(
        { success: true, message: "Webhook processed: payment pending" },
        { status: 200 }
      );
    }

    // Unknown status, just acknowledge
    return NextResponse.json(
      { success: true, message: "Webhook processed: status recorded" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing PayU webhook:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process webhook",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
