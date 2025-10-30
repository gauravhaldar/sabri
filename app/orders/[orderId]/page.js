"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orderId } = params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewState, setReviewState] = useState({ productId: "", rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) setOrder(data.data.order);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Order not found.</p>
          <Link href="/profile" className="mt-4 inline-block px-4 py-2 bg-neutral-900 text-white rounded-md">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-neutral-900">Order #{order.orderId}</h1>
          <p className="text-neutral-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Summary */}
          <div className="border border-neutral-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Payment</p>
              <p className="font-medium capitalize">{order.paymentMethod?.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Items</p>
              <p className="font-medium">{order.items?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total</p>
              <p className="font-medium">₹{order.orderSummary?.total?.toLocaleString?.() || order.orderSummary?.total}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h2 className="font-semibold text-neutral-900 mb-2">Shipping Address</h2>
            <p className="text-sm text-neutral-700">{order.shippingAddress?.name}</p>
            <p className="text-sm text-neutral-700">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && (
              <p className="text-sm text-neutral-700">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-sm text-neutral-700">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
            </p>
            <p className="text-sm text-neutral-700">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Items */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h2 className="font-semibold text-neutral-900 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 rounded object-cover border border-neutral-200" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-600">
                      {item.size ? `Size: ${item.size}` : null}
                      {item.size && item.color ? " • " : null}
                      {item.color ? `Color: ${item.color}` : null}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-900">₹{item.price} × {item.quantity}</p>
                    <p className="text-xs text-neutral-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Section - Only when delivered */}
          {order.status === "delivered" && (
            <div className="border border-neutral-200 rounded-lg p-4">
              <h2 className="font-semibold text-neutral-900 mb-2">Write a Review</h2>
              <p className="text-sm text-neutral-600 mb-4">Share your experience with the products you received.</p>
              {reviewMessage && (
                <div className="mb-3 text-sm {reviewMessage.includes('success') ? 'text-green-600' : 'text-red-600'}">
                  {reviewMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Product</label>
                  <select
                    value={reviewState.productId}
                    onChange={(e) => setReviewState((s) => ({ ...s, productId: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  >
                    <option value="">Select product</option>
                    {order.items?.map((item, idx) => (
                      <option key={idx} value={item.productId}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Rating</label>
                  <select
                    value={reviewState.rating}
                    onChange={(e) => setReviewState((s) => ({ ...s, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  >
                    {[5,4,3,2,1].map((r) => (
                      <option key={r} value={r}>{r} ⭐</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Comment (optional)</label>
                  <textarea
                    rows={3}
                    value={reviewState.comment}
                    onChange={(e) => setReviewState((s) => ({ ...s, comment: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                    placeholder="Tell us what you liked or what could be better"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  disabled={reviewSubmitting}
                  onClick={async () => {
                    setReviewMessage("");
                    try {
                      if (!reviewState.productId) {
                        setReviewMessage("Please select a product.");
                        return;
                      }
                      setReviewSubmitting(true);
                      const user = JSON.parse(localStorage.getItem("userData") || "{}");
                      const res = await fetch("/api/reviews", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: user?.id,
                          productId: reviewState.productId,
                          orderId: order.orderId,
                          rating: reviewState.rating,
                          comment: reviewState.comment,
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setReviewMessage("Review submitted successfully.");
                        setReviewState({ productId: "", rating: 5, comment: "" });
                      } else {
                        setReviewMessage(data.message || "Failed to submit review.");
                      }
                    } catch (e) {
                      setReviewMessage("Failed to submit review.");
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link href="/profile" className="text-neutral-700 hover:underline">← Back to orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


