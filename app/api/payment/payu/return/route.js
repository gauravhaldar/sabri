import { NextResponse } from "next/server";

// This route handles browser redirects (surl/furl/curl) from PayU.
// PayU POSTS form data to these URLs. We convert the POST body to query params
// and then 302 redirect the user to our Next.js pages under /payment/*.

/**
 * Convert FormData to plain object
 */
const formDataToObject = (formData) => {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
};

/**
 * Choose destination page based on type or status
 */
const resolveDestinationPath = (type, status) => {
  if (type === "success") return "/payment/success";
  if (type === "failure") return "/payment/failure";
  if (type === "cancel") return "/payment/cancel";

  const s = (status || "").toLowerCase();
  if (s === "success") return "/payment/success";
  if (s === "failed") return "/payment/failure";
  if (s === "cancel" || s === "cancelled") return "/payment/cancel";
  // default fallback
  return "/payment/failure";
};

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // success|failure|cancel
    const formData = await request.formData();
    const data = formDataToObject(formData);

    // Build destination URL relative to current request origin
    const destPath = resolveDestinationPath(type, data.status);
    const redirectUrl = new URL(destPath, request.url);

    // Append key PayU fields as query params so the client page can display/verify
    const passThroughKeys = [
      // Core identifiers
      "txnid",
      "mihpayid",
      "status",
      "amount",
      // Hashing essentials
      "hash",
      "key",
      "additional_charges",
      "mode",
      "bankcode",
      "bank_ref_no",
      "error",
      "error_Message",
      "productinfo",
      "email",
      "firstname",
      "udf1",
      "udf2",
      "udf3",
      "udf4",
      "udf5",
    ];
    for (const k of passThroughKeys) {
      if (data[k] != null && data[k] !== "") {
        redirectUrl.searchParams.set(k, String(data[k]));
      }
    }

    // 302 redirect the browser to the corresponding page
    return NextResponse.redirect(redirectUrl, 302);
  } catch (err) {
    console.error("PayU Return Handler Error:", err);
    // As a last resort, send a minimal HTML with a link
    return new NextResponse(
      `<html><body>
        <h1>Payment Redirect Error</h1>
        <p>We couldn't redirect you automatically. Please click below:</p>
        <p><a href="/payment/failure">Go to payment result</a></p>
      </body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

// Optional GET handler to help with debugging if needed
export async function GET(request) {
  const url = new URL(request.url);
  return NextResponse.json({
    ok: true,
    message: "This endpoint expects POST from PayU and will redirect.",
    query: Object.fromEntries(url.searchParams.entries()),
  });
}
