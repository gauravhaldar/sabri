import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

// PayU Configuration - All values must be set in .env.local
const PAYU_CONFIG = {
  MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY,
  MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT,
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://secure.payu.in"
      : "https://test.payu.in",
  SUCCESS_URL: process.env.PAYU_SUCCESS_URL,
  FAILURE_URL: process.env.PAYU_FAILURE_URL,
  CANCEL_URL: process.env.PAYU_CANCEL_URL,
};

// Validate required PayU configuration
if (!PAYU_CONFIG.MERCHANT_KEY || !PAYU_CONFIG.MERCHANT_SALT) {
  console.error(
    "❌ PayU configuration missing! Please set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT in .env.local"
  );
}

/**
 * Build hash string for PayU payment request
 * Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 * Total: 8 fields + udf1 + udf2 + udf3 + udf4 + udf5 + 6 empty + salt = 17 elements
 */
const buildRequestHashString = (params, salt) => {
  // Build the exact string as per PayU's format
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${
    params.productinfo
  }|${params.firstname}|${params.email}|${params.udf1 || ""}|${
    params.udf2 || ""
  }|${params.udf3 || ""}|${params.udf4 || ""}|${
    params.udf5 || ""
  }||||||${salt}`;

  return hashString;
};

/**
 * Generate SHA512 hash for PayU payment request
 * Returns a single lowercase hash string
 */
const generatePayUHash = (params) => {
  const hashString = buildRequestHashString(params, PAYU_CONFIG.MERCHANT_SALT);

  // Debug: Log the hash string to verify it matches PayU's expected format
  console.log("Hash String:", hashString);

  const hash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toLowerCase();

  console.log("Generated Hash:", hash);

  // Return plain string - PayU will wrap it in {v1, v2} format automatically
  return hash;
};

export async function POST(request) {
  try {
    // Validate PayU configuration
    if (!PAYU_CONFIG.MERCHANT_KEY || !PAYU_CONFIG.MERCHANT_SALT) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayU payment gateway is not configured. Please contact administrator.",
          error:
            "Missing PAYU_MERCHANT_KEY or PAYU_MERCHANT_SALT in environment variables",
        },
        { status: 500 }
      );
    }

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
    payUParams.hash = generatePayUHash(payUParams);

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
