import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

// PayU Configuration
const PAYU_CONFIG = {
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY,
  MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT,
};

/**
 * Verify hash for PayU response (Reverse Hashing)
 * Formula for regular integration: SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 * Formula with additional_charges: additional_charges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
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
    hashString = `${additional_charges}|${PAYU_CONFIG.MERCHANT_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    hashString = `${PAYU_CONFIG.MERCHANT_SALT}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }

  console.log("Response Hash String:", hashString);

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toLowerCase(); // Ensure lowercase comparison

  console.log("Hash verification:", {
    received: hash?.toLowerCase(),
    calculated: calculatedHash,
    matches: calculatedHash === hash?.toLowerCase(),
  });

  return calculatedHash === hash?.toLowerCase();
};

export async function POST(request) {
  try {
    const data = await request.json();

    console.log("Payment validation request received:", {
      txnid: data.txnid,
      status: data.status,
      amount: data.amount,
    });

    // Validate required parameters
    if (!data.txnid || !data.status || !data.hash) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required payment parameters",
        },
        { status: 400 }
      );
    }

    // Verify hash to ensure authenticity
    const isValidHash = verifyResponseHash(data);
    if (!isValidHash) {
      console.error("❌ Invalid hash received from PayU");
      console.error("Response data:", {
        txnid: data.txnid,
        status: data.status,
        receivedHash: data.hash,
      });
      return NextResponse.json(
        { success: false, message: "Invalid payment response - Hash mismatch" },
        { status: 400 }
      );
    }

    console.log("✅ Hash verified successfully");

    await connectDB();

    // Get order ID from udf1
    const orderId = data.udf1;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID not found in payment response",
        },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
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
      responseData: data, // Store full response for debugging
    };

    // Update order status based on payment status
    if (paymentStatus === "success") {
      order.orderStatus = "confirmed";
      order.paymentStatus = "paid";
    } else if (paymentStatus === "failure" || paymentStatus === "failed") {
      order.orderStatus = "payment_failed";
      order.paymentStatus = "failed";
    } else if (paymentStatus === "pending") {
      order.orderStatus = "pending";
      order.paymentStatus = "pending";
    } else if (paymentStatus === "cancelled" || paymentStatus === "cancel") {
      order.orderStatus = "cancelled";
      order.paymentStatus = "cancelled";
    }

    await order.save();

    // If payment succeeded, clear user's cart on the server for reliability
    if (paymentStatus === "success") {
      try {
        const userId = order.user;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            user.cartData = {};
            user.markModified("cartData");
            await user.save();
            console.log(
              "🧹 Cleared server-side cart for user:",
              String(userId)
            );
          }
        }
      } catch (e) {
        console.error("Failed to clear server-side cart after success:", e);
        // Do not fail the validation due to cart clear issues
      }
    }

    console.log("✅ Order updated successfully:", {
      orderId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order.orderId,
        txnId: data.txnid,
        amount: data.amount,
        status: paymentStatus,
        mode: data.mode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error validating payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to validate payment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
