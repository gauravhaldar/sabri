import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

// PayU Configuration
const PAYU_CONFIG = {
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY || "gtKFFx",
  MERCHANT_SALT_V1:
    process.env.PAYU_MERCHANT_SALT_V1 || "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW",
  MERCHANT_SALT_V2:
    process.env.PAYU_MERCHANT_SALT_V2 || "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW",
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://secure.payu.in"
      : "https://test.payu.in",
  SUCCESS_URL:
    process.env.PAYU_SUCCESS_URL || "http://localhost:3000/payment/success",
  FAILURE_URL:
    process.env.PAYU_FAILURE_URL || "http://localhost:3000/payment/failure",
  CANCEL_URL:
    process.env.PAYU_CANCEL_URL || "http://localhost:3000/payment/cancel",
};

/**
 * Build hash string for PayU payment request
 * Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 */
const buildRequestHashString = (params, salt) => {
  return [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    "",
    "",
    "",
    "",
    "",
    "",
    salt,
  ].join("|");
};

/**
 * Generate SHA512 hash for PayU payment request
 */
const generatePayUHashes = (params) => {
  const v1 = crypto
    .createHash("sha512")
    .update(buildRequestHashString(params, PAYU_CONFIG.MERCHANT_SALT_V1))
    .digest("hex");
  const v2 = crypto
    .createHash("sha512")
    .update(buildRequestHashString(params, PAYU_CONFIG.MERCHANT_SALT_V2))
    .digest("hex");

  return { v1, v2 };
};

export async function POST(request) {
  try {
    const { orderId, amount, customerInfo, productInfo } = await request.json();

    // Validate required fields
    if (!orderId || !amount || !customerInfo || !productInfo) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required payment information",
        },
        { status: 400 }
      );
    }

    await connectDB();

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

    // Generate unique transaction ID
    const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Prepare PayU parameters
    const payUParams = {
      key: PAYU_CONFIG.MERCHANT_KEY,
      txnid: txnId,
      amount: parseFloat(amount).toFixed(2), // Ensure 2 decimal places
      productinfo: productInfo,
      firstname: customerInfo.firstname,
      email: customerInfo.email,
      phone: customerInfo.phone,
      surl: PAYU_CONFIG.SUCCESS_URL,
      furl: PAYU_CONFIG.FAILURE_URL,
      curl: PAYU_CONFIG.CANCEL_URL,
      udf1: orderId, // Store orderId for reference
      udf2: customerInfo.lastname || "",
      udf3: "",
      udf4: "",
      udf5: "",
    };

    // Generate hash for the payment request
    const hashes = generatePayUHashes(payUParams);
    // PayU expects hash field as a JSON string containing both v1 & v2 hashes
    payUParams.hash = JSON.stringify(hashes);

    // Update order with transaction ID and payment details
    order.paymentDetails = {
      txnId,
      amount: parseFloat(amount),
      status: "pending",
      gateway: "payu",
      initiatedAt: new Date(),
    };
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment request created successfully",
      data: {
        payUParams,
        paymentUrl: `${PAYU_CONFIG.BASE_URL}/_payment`,
        orderId,
        txnId,
      },
    });
  } catch (error) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
