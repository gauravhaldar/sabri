"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get all payment response parameters
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log("Payment Failure - Received params:", params);
    setPaymentData(params);

    // Clean up any pending order payload since payment failed
    try {
      sessionStorage.removeItem("pendingOrderPayload");
    } catch {}

    // Log failed payment
    logFailedPayment(params);
  }, [searchParams]);

  const logFailedPayment = async (params) => {
    try {
      await fetch("/api/payment/payu/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error("Error logging failed payment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-4">
            Unfortunately, your payment could not be processed.
          </p>
          {paymentData?.error_Message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {paymentData.error_Message}
              </p>
            </div>
          )}
        </div>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            {paymentData.txnid && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{paymentData.txnid}</span>
              </div>
            )}
            {paymentData.udf1 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{paymentData.udf1}</span>
              </div>
            )}
            {paymentData.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{paymentData.amount}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Don&apos;t worry, no money has been deducted from your account.
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Return to Home
          </button>
          <button
            onClick={() => router.push("/contact-us")}
            className="w-full text-blue-600 hover:text-blue-700 text-sm"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailure() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}
