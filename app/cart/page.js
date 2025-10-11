"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function CartPage() {
  const { user } = useAuth();
  const {
    cartItems,
    cartCount,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  } = useCart();
  const toast = useToast();

  const [localLoading, setLocalLoading] = useState({});

  // Fetch cart on component mount
  useEffect(() => {
    if (user?._id) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleUpdateQuantity = async (cartKey, newQuantity) => {
    if (newQuantity < 1) return;

    setLocalLoading((prev) => ({ ...prev, [cartKey]: true }));

    const success = await updateQuantity(cartKey, newQuantity);
    if (!success) {
      toast.error("Failed to update quantity");
    }

    setLocalLoading((prev) => ({ ...prev, [cartKey]: false }));
  };

  const handleRemoveItem = async (cartKey, itemName) => {
    setLocalLoading((prev) => ({ ...prev, [cartKey]: true }));

    const success = await removeFromCart(cartKey);
    if (!success) {
      toast.error("Failed to remove item");
    }

    setLocalLoading((prev) => ({ ...prev, [cartKey]: false }));
  };

  const moveToWishlist = (item) => {
    // Add to wishlist logic here
    console.log("Moved to wishlist:", item);
    handleRemoveItem(item.productId, item.name);
  };

  const calculateSubtotal = () => {
    const itemsArray = Object.values(cartItems);
    return itemsArray.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateSavings = () => {
    const itemsArray = Object.values(cartItems);
    return itemsArray.reduce((total, item) => {
      const originalTotal = (item.originalPrice || item.price) * item.quantity;
      const currentTotal = item.price * item.quantity;
      return total + (originalTotal - currentTotal);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
    const tax = subtotal * 0.18; // 18% GST
    return subtotal + shipping + tax;
  };

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    console.log("Proceeding to checkout...");
    // Redirect to checkout page (you can create this later)
    alert("Checkout functionality will be implemented soon!");
  };

  // Loading state
  if (loading && cartCount === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!loading && cartCount === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-neutral-50 py-8 pt-40">
          <div className="container mx-auto px-4">
            <Link
              href="/"
              className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Your Cart
              </h1>
              <p className="text-neutral-600">Your cart is empty</p>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-neutral-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
            </div>
            <Link
              href="/best-sellers"
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Your Cart
            </h1>
            <p className="text-neutral-600">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {Object.entries(cartItems).map(([cartKey, item]) => (
                  <div
                    key={cartKey}
                    className="bg-white border border-neutral-200 rounded-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.images?.[0] || "/placeholder-image.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/products/${item.productId}`}>
                              <h3 className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-neutral-600 mt-1">
                              {item.category}
                            </p>
                            {(item.size || item.color) && (
                              <p className="text-sm text-neutral-600">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && " • "}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(cartKey, item.name)}
                            disabled={localLoading[cartKey]}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-neutral-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <>
                                  <span className="text-sm text-neutral-500 line-through">
                                    ₹{item.originalPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                    {Math.round(
                                      ((item.originalPrice - item.price) /
                                        item.originalPrice) *
                                        100
                                    )}
                                    % OFF
                                  </span>
                                </>
                              )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-neutral-300 rounded-md">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(cartKey, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || localLoading[cartKey]
                              }
                              className="px-3 py-2 hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-neutral-300 text-sm font-medium">
                              {localLoading[cartKey] ? "..." : item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(cartKey, item.quantity + 1)
                              }
                              disabled={localLoading[cartKey]}
                              className="px-3 py-2 hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200">
                          <span className="text-sm text-neutral-600">
                            Item Total:
                          </span>
                          <span className="font-semibold text-neutral-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/best-sellers"
                  className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      Subtotal ({cartCount} items)
                    </span>
                    <span className="font-medium">
                      ₹{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                      {calculateSubtotal() > 5000 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹200`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tax (GST 18%)</span>
                    <span className="font-medium">
                      ₹{(calculateSubtotal() * 0.18).toLocaleString()}
                    </span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">You Save</span>
                      <span className="font-medium text-green-600">
                        ₹{calculateSavings().toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-neutral-900">
                        Total
                      </span>
                      <span className="font-semibold text-neutral-900">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                    <button className="px-4 py-2 border border-neutral-900 text-neutral-900 text-sm rounded-md hover:bg-neutral-50">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-6 bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Secure Checkout
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded border border-neutral-200 px-2 py-2">
                    Free Shipping
                  </div>
                  <div className="rounded border border-neutral-200 px-2 py-2">
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
