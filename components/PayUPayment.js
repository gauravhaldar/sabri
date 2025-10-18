"use client";
import { useState } from "react";

export default function PayUPayment({
  orderId,
  amount,
  customerInfo,
  productInfo,
  reference,
}) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Create payment request
      const response = await fetch("/api/payment/payu/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          reference,
          customerInfo: {
            firstname:
              customerInfo.firstname ||
              customerInfo.name?.split(" ")[0] ||
              "Customer",
            lastname:
              customerInfo.lastname ||
              customerInfo.name?.split(" ").slice(1).join(" ") ||
              "",
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
          productInfo: productInfo || "Order Payment",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Create a form and submit it to PayU
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.data.paymentUrl;

        // Add all PayU parameters as hidden fields
        Object.keys(data.data.payUParams).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.data.payUParams[key];
          form.appendChild(input);
        });

        // Append form to body and submit
        document.body.appendChild(form);
        form.submit();
      } else {
        alert(data.message || "Failed to initiate payment");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={loading}
      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        "Pay Now with PayU"
      )}
    </button>
  );
}
