import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import Coupon from "@/lib/models/Coupon";
import Sequence from "@/lib/models/Sequence";

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

    // Connect DB early to allow fallback cleanup even if hash fails
    await connectDB();

    // Verify hash to ensure authenticity
    const isValidHash = verifyResponseHash(data);
    if (!isValidHash) {
      console.error("❌ Invalid hash received from PayU");
      console.error("Response data:", {
        txnid: data.txnid,
        status: data.status,
        receivedHash: data.hash,
      });

      // Fallback: If status indicates failure/cancel and we have an orderId, remove pending order to keep admin clean
      try {
        const statusLc = String(data.status || "").toLowerCase();
        const isFailState = [
          "failure",
          "failed",
          "cancelled",
          "cancel",
        ].includes(statusLc);
        const orderId = data.udf1;
        if (isFailState && orderId) {
          const order = await Order.findOne({ orderId });
          if (
            order &&
            order.status === "pending" &&
            order.paymentMethod === "online_payment"
          ) {
            // Decrement coupon usage if needed
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
                "Coupon decrement failed (hash-mismatch fallback, non-fatal):",
                couponErr
              );
            }
            await Order.deleteOne({ _id: order._id });
            console.warn(
              "🗑️ Deleted pending order after failed/cancelled payment with invalid hash:",
              orderId
            );
            return NextResponse.json({
              success: true,
              message:
                "Payment failed/cancelled (unverified); pending order removed",
            });
          }
        }
      } catch (cleanupErr) {
        console.error(
          "Fallback cleanup after hash failure errored:",
          cleanupErr
        );
      }

      return NextResponse.json(
        { success: false, message: "Invalid payment response - Hash mismatch" },
        { status: 400 }
      );
    }

    console.log("✅ Hash verified successfully");

    // Get order ID from udf1 if present (legacy flow). In the new flow, udf1 may contain a reference (e.g., userId/email)
    const udf1 = data.udf1;
    let orderId = udf1 || null;
    let order = null;
    if (orderId) {
      order = await Order.findOne({ orderId });
    }

    // Update order payment details
    const paymentStatus = data.status.toLowerCase();

    // We'll fill payment details either on the existing order or keep for response if creating now
    const paymentDetailsPatch = {
      ...(order?.paymentDetails || {}),
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
      responseData: data,
    };

    // Handle by payment status
    if (paymentStatus === "success") {
      // Legacy path: If an order already exists (COD reserved), mark it paid
      if (order) {
        order.status = "confirmed";
        order.invoice = { ...order.invoice, paymentStatus: "paid" };
        order.paymentDetails = paymentDetailsPatch;
        await order.save();

        // Clear server-side cart for this user for reliability
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
        }

        console.log("✅ Order updated successfully:", {
          orderId,
          status: order.status,
          paymentStatus: order.invoice?.paymentStatus,
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
            orderStatus: order.status,
            paymentStatus: order.invoice?.paymentStatus,
          },
        });
      }

      // New path: no order yet; return success so client can create an order with full details
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId: null,
          txnId: data.txnid,
          amount: data.amount,
          status: paymentStatus,
          mode: data.mode,
        },
      });
    }

    // For failure/cancel/pending
    if (
      paymentStatus === "failure" ||
      paymentStatus === "failed" ||
      paymentStatus === "cancelled" ||
      paymentStatus === "cancel"
    ) {
      // Optionally adjust coupon usage if we incremented during order creation
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
        console.warn("Coupon decrement failed (non-fatal):", couponErr);
      }

      // Remove the order so failed payments don't appear in admin
      await Order.deleteOne({ _id: order._id });

      console.log("🗑️ Deleted order due to failed/cancelled payment:", orderId);

      return NextResponse.json({
        success: true,
        message: "Payment failed/cancelled; order removed",
        data: {
          orderId,
          txnId: data.txnid,
          amount: data.amount,
          status: paymentStatus,
        },
      });
    }

    if (paymentStatus === "pending") {
      // Keep order as pending, mark invoice as pending
      order.status = "pending";
      order.invoice = { ...order.invoice, paymentStatus: "pending" };
      await order.save();

      return NextResponse.json({
        success: true,
        message: "Payment pending",
        data: {
          orderId: order.orderId,
          txnId: data.txnid,
          amount: data.amount,
          status: paymentStatus,
          orderStatus: order.status,
          paymentStatus: order.invoice?.paymentStatus,
        },
      });
    }

    // Fallback
    return NextResponse.json({
      success: true,
      message: "Payment status recorded",
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
