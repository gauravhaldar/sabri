"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  Copy,
  Download,
  ArrowRight,
  Calendar,
  MapPin,
  Package,
  CreditCard,
} from "lucide-react";
import Invoice from "./Invoice";
import {
  generateInvoicePDF,
  generateInvoiceFilename,
} from "../utils/invoiceUtils";

export default function OrderSuccessModal({ isOpen, onClose, orderData }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef(null);

  if (!isOpen || !orderData) return null;

  // Debug: Log the orderData structure
  console.log("OrderSuccessModal - orderData:", orderData);
  console.log(
    "OrderSuccessModal - shippingAddress:",
    orderData.shippingAddress
  );

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setDownloading(true);

    try {
      // Create a temporary container for the invoice
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm";
      tempContainer.style.backgroundColor = "#ffffff";

      document.body.appendChild(tempContainer);

      // Render the invoice component
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempContainer);

      root.render(<Invoice orderData={orderData} />);

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate PDF
      const filename = generateInvoiceFilename(orderData);
      const success = await generateInvoicePDF(tempContainer, filename);

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      if (success) {
        // Show success message (you can use toast here if available)
        console.log("Invoice downloaded successfully");
      } else {
        console.error("Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Invalid date";
      }

      return date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", dateString);
      return "Date formatting error";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl">
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 text-white hover:text-green-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  Order Placed Successfully!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-100"
                >
                  Thank you for your purchase. Your order has been confirmed.
                </motion.p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Order Details
                  </h3>
                  <button
                    onClick={handleCopyOrderId}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Order ID"}
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono font-semibold">
                      {orderData.orderId || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold">
                      {formatDate(orderData.createdAt)}
                    </span>
                  </div>
                  {orderData.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">Expected Delivery:</span>
                      <span className="font-semibold text-blue-600">
                        {formatDate(orderData.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Information */}
              {orderData.shippingAddress && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Delivery Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Delivering to:</span>
                      <div className="font-semibold text-gray-900">
                        {orderData.shippingAddress.name || "N/A"}
                      </div>
                      <div className="text-gray-600">
                        {orderData.shippingAddress.addressLine1 || "N/A"}
                        {orderData.shippingAddress.addressLine2 && (
                          <>, {orderData.shippingAddress.addressLine2}</>
                        )}
                      </div>
                      <div className="text-gray-600">
                        {orderData.shippingAddress.city || "N/A"},{" "}
                        {orderData.shippingAddress.state || "N/A"} -{" "}
                        {orderData.shippingAddress.zipCode || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Payment Information
                </h3>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold">
                      {orderData.paymentMethod === "cash_on_delivery"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-gray-900">
                      ₹{(orderData.orderSummary?.total || 0).toLocaleString()}
                    </span>
                  </div>

                  {orderData.paymentMethod === "cash_on_delivery" && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        💡 You&apos;ll pay ₹
                        {(orderData.orderSummary?.total || 0).toLocaleString()}{" "}
                        when your order is delivered.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Summary */}
              {orderData.items && orderData.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.name || "Unnamed Item"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.category || "No Category"}
                            {(item.size || item.color) && (
                              <span className="ml-2">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && " • "}
                                {item.color && `Color: ${item.color}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₹
                            {(
                              (item.price || 0) * (item.quantity || 0)
                            ).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </>
                  )}
                </button>

                <button
                  onClick={() => onClose("/")}
                  className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
