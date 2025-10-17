"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get all payment response parameters
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log("Payment Cancel - Received params:", params);
    setPaymentData(params);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
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
            Payment Cancelled
          </h2>
          <p className="text-gray-600 mb-4">
            You have cancelled the payment process.
          </p>
        </div>

        {paymentData && paymentData.txnid && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{paymentData.txnid}</span>
            </div>
            {paymentData.udf1 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{paymentData.udf1}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Your order is still in your cart. You can complete it anytime.
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Cart
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/contact-us")}
            className="w-full text-blue-600 hover:text-blue-700 text-sm"
          >
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
}
