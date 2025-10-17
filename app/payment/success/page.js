"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentSuccessContent() {
  const { clearCart, fetchCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ranRef = useRef(false);
  const safeNavigate = useCallback(
    (url) => {
      try {
        router.push(url);
      } catch (e) {
        try {
          window.location.assign(url);
        } catch (err) {
          console.error("Navigation failed:", err);
        }
      }
    },
    [router]
  );
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ranRef.current) return; // guard against repeated runs due to re-renders
    ranRef.current = true;
    // Get all payment response parameters
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log("Payment Success - Received params:", params);

    // Basic parameter validation to avoid hanging state if gateway didn't send expected fields
    if (!params?.txnid || !params?.status || !params?.hash) {
      setError(
        "Missing payment parameters from gateway. Please check your payment status or contact support."
      );
      setVerifying(false);
      return;
    }
    // Verify hash and process payment
    (async () => {
      try {
        // Add a fetch timeout using AbortController to prevent indefinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch("/api/payment/payu/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.success) {
          setPaymentData(data.data);
          setVerifying(false);

          // Clear client-side cart optimistically, then refetch from server
          try {
            await clearCart();
            await fetchCart();
          } catch (e) {
            console.warn("Cart clear post-success had a minor issue:", e);
          }

          // Redirect to order details after 5 seconds
          setTimeout(() => {
            safeNavigate(`/orders/${data.data.orderId}`);
          }, 5000);
        } else {
          setError(data.message || "Payment verification failed");
          setVerifying(false);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("Failed to verify payment");
        setVerifying(false);
      }
    })();
    // Intentionally no dependencies: we only want to run once after mount/redirect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/cart")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Cart
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for your order. Your payment has been processed
            successfully.
          </p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{paymentData.txnId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">₹{paymentData.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Mode:</span>
              <span className="font-medium">{paymentData.mode}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center">
            Redirecting to order details in 5 seconds...
          </p>
          <button
            type="button"
            onClick={() =>
              safeNavigate(`/orders/${paymentData?.orderId || ""}`)
            }
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Order Details
          </button>
          <button
            type="button"
            onClick={() => safeNavigate("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessContent;
