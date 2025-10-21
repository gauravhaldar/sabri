"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  Tag,
  X,
  MapPin,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import CouponModal from "@/components/CouponModal";
import AddressModal from "@/components/AddressModal";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import PayUPayment from "@/components/PayUPayment";

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

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [suggestedCoupons, setSuggestedCoupons] = useState([]);

  // Address state
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  // Payment and order state
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [orderLoading, setOrderLoading] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

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

  // Single source of truth for coupon discount calculation
  const calculateCouponDiscount = useCallback((subtotalAmount, coupon) => {
    if (!coupon) return 0;

    if (coupon.type === "flat") {
      return coupon.amount;
    } else if (coupon.type === "percentage") {
      return Math.floor((subtotalAmount * coupon.amount) / 100);
    }
    return 0;
  }, []);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
    // For 3% GST inclusive, the tax is already included in the prices
    // We calculate the tax amount that's included in the subtotal
    const taxableAmount = subtotal - couponDiscount;
    const tax = (taxableAmount * 0.03) / 1.03; // Extract 3% GST from inclusive amount
    
    // Apply 5% discount for online payment
    const onlinePaymentDiscount = paymentMethod === 'online_payment' ? (subtotal - couponDiscount) * 0.05 : 0;
    
    return subtotal - couponDiscount - onlinePaymentDiscount + shipping;
  };

  // Handle apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);

    try {
      const currentSubtotal = calculateSubtotal();

      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: currentSubtotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data.couponDetails);
        const calculatedDiscount = calculateCouponDiscount(
          currentSubtotal,
          data.data.couponDetails
        );
        setCouponDiscount(calculatedDiscount);
        toast.success(`Coupon applied! You saved ₹${calculatedDiscount}`);
      } else {
        toast.error(data.message || "Invalid coupon code");
        setCouponCode("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Handle coupon selection from modal
  const handleSelectCouponFromModal = async (code) => {
    setCouponCode(code);

    // Apply the coupon directly
    setCouponLoading(true);

    try {
      const currentSubtotal = calculateSubtotal();

      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          orderAmount: currentSubtotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data.couponDetails);
        const calculatedDiscount = calculateCouponDiscount(
          currentSubtotal,
          data.data.couponDetails
        );
        setCouponDiscount(calculatedDiscount);
        toast.success(
          `Coupon ${code} applied! You saved ₹${calculatedDiscount}`
        );
      } else {
        toast.error(data.message || "Invalid coupon code");
        setCouponCode("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
      setCouponCode("");
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle address added
  const handleAddressAdded = (address) => {
    setSelectedAddress(address);
    setDeliveryAvailable(true);
    console.log("Address added:", address);
  };

  // Handle remove address
  const handleRemoveAddress = () => {
    setSelectedAddress(null);
    setDeliveryAvailable(true);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    console.log("=== ORDER PLACEMENT STARTED ===");
    console.log("User:", user);
    console.log("Selected address:", selectedAddress);
    console.log("Cart items:", Object.values(cartItems));

    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    if (!selectedAddress) {
      toast.error("Please add a delivery address");
      return;
    }

    if (!deliveryAvailable) {
      toast.error("Delivery not available to this location");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setOrderLoading(true);

    try {
      const cartItemsArray = Object.values(cartItems);
      const subtotal = calculateSubtotal();
      const taxableAmount = subtotal - couponDiscount;
      const tax = (taxableAmount * 0.03) / 1.03; // Extract 3% GST from inclusive amount
      const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
      
      // Apply 5% discount for online payment
      const onlinePaymentDiscount = paymentMethod === 'online_payment' ? (subtotal - couponDiscount) * 0.05 : 0;
      
      const total = subtotal - couponDiscount - onlinePaymentDiscount + shipping;

      // Prepare order data
      const orderData = {
        items: cartItemsArray.map((item) => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          category: item.category,
          image: item.images?.[0] || item.image,
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        orderSummary: {
          subtotal,
          couponDiscount,
          couponCode: appliedCoupon?.code,
          onlinePaymentDiscount: Math.round(onlinePaymentDiscount * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          shippingCharge: shipping,
          total: Math.round(total * 100) / 100,
        },
        notes: "",
        userId: user.id || user._id, // Pass user ID in the request body
      };

      console.log("User object:", user);
      console.log("User ID being sent:", user.id || user._id);
      console.log("Making API request with data:", orderData);

      if (paymentMethod === "online_payment") {
        // Do NOT create order yet. Save payload in state and sessionStorage so success page can re-post it with paymentVerified.
        setPendingOrderPayload(orderData);
        try {
          sessionStorage.setItem(
            "pendingOrderPayload",
            JSON.stringify(orderData)
          );
        } catch {}
        setOrderData({
          orderId: "PREPAY",
          orderSummary: orderData.orderSummary,
        });
        setShowPaymentModal(true);
        toast.info("You will be redirected to payment");
      } else {
        // COD flow: create order immediately
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("API Response:", data);
        if (data.success) {
          setOrderData(data.data);
          setShowOrderSuccess(true);
          toast.success("Order placed successfully!");
        } else {
          console.error("❌ Order failed:", data.message);
          toast.error(data.message || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("❌ Order placement error:", error);
      toast.error("Failed to place order");
    } finally {
      setOrderLoading(false);
      console.log("=== ORDER PLACEMENT COMPLETED ===");
    }
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
        <div className="bg-neutral-50 py-6 sm:py-8 pt-28 sm:pt-40">
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
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-neutral-600 mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
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
      <div className="bg-neutral-50 py-6 sm:py-8 pt-28 sm:pt-40">
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

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {Object.entries(cartItems).map(([cartKey, item]) => (
                  <div
                    key={cartKey}
                    className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <Image
                          src={item.images?.[0] || "/placeholder-image.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Link href={`/products/${item.productId}`}>
                              <h3 className="text-sm sm:text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                              {item.category}
                            </p>
                            {(item.size || item.color) && (
                              <p className="text-xs sm:text-sm text-neutral-600">
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 sm:mt-4">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-base sm:text-lg font-semibold text-neutral-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <>
                                  <span className="text-xs sm:text-sm text-neutral-500 line-through">
                                    ₹{item.originalPrice.toLocaleString()}
                                  </span>
                                  <span className="text-[11px] sm:text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
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
                          <div className="flex items-center border border-neutral-300 rounded-md self-end sm:self-auto">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(cartKey, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || localLoading[cartKey]
                              }
                              className="px-2.5 sm:px-3 py-2 hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 sm:px-4 py-2 border-x border-neutral-300 text-sm font-medium">
                              {localLoading[cartKey] ? "..." : item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(cartKey, item.quantity + 1)
                              }
                              disabled={localLoading[cartKey]}
                              className="px-2.5 sm:px-3 py-2 hover:bg-neutral-50 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-neutral-200">
                          <span className="text-xs sm:text-sm text-neutral-600">
                            Item Total:
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-neutral-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
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
              <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6 lg:sticky lg:top-8">
                <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
                  Order Summary
                </h2>

                {/* Coupon Section */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Apply Coupon Code
                    </h3>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Available
                    </button>
                  </div>

                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g., SAVE10)"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                          disabled={couponLoading}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleApplyCoupon()
                          }
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[60px]"
                        >
                          {couponLoading ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500">
                        Enter your coupon code to get discount on your order
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-green-800">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-[11px] sm:text-xs text-green-600">
                            {appliedCoupon.name} • Saved ₹
                            {couponDiscount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                        title="Remove coupon"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Address Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                  </div>

                  {!selectedAddress ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Add Delivery Address
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        We&apos;ll check if we deliver to your location
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between p-3 bg-white border border-gray-200 rounded-md">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {selectedAddress.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              ✓ Available
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.addressLine1}
                            {selectedAddress.addressLine2 &&
                              `, ${selectedAddress.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.city}, {selectedAddress.state} -{" "}
                            {selectedAddress.zipCode}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedAddress.phone} • {selectedAddress.email}
                          </p>
                          {selectedAddress.shippingInfo && (
                            <p className="text-xs text-blue-600 mt-1">
                              Shipping: ₹
                              {selectedAddress.shippingInfo.finalCharge} to{" "}
                              {selectedAddress.shippingInfo.state}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleRemoveAddress}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors ml-2"
                          title="Remove address"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Change Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method Section */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                      💳 Payment Method
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "cash_on_delivery"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === "cash_on_delivery"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "cash_on_delivery" && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              Cash on Delivery
                            </span>
                            <p className="text-[11px] sm:text-xs text-gray-500">
                              Pay when your order is delivered
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] sm:text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>

                    {/* Online Payment - Enabled */}
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "online_payment"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("online_payment")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === "online_payment"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "online_payment" && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              Online Payment
                            </span>
                            <p className="text-[11px] sm:text-xs text-gray-500">
                              Credit/Debit Card, UPI, Net Banking, Wallets
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] sm:text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Available
                          </span>
                          <div className="flex gap-1">
                            <Image
                              src="/icons/visa.svg"
                              alt="Visa"
                              width={24}
                              height={16}
                              className="h-3 w-auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <Image
                              src="/icons/mastercard.svg"
                              alt="Mastercard"
                              width={24}
                              height={16}
                              className="h-3 w-auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <span className="text-[10px] text-gray-500">
                              +UPI
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-neutral-600">
                      Subtotal ({cartCount} items)
                    </span>
                    <span className="font-medium">
                      ₹{calculateSubtotal().toLocaleString()}
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

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Coupon Discount ({appliedCoupon?.code})
                      </span>
                      <span className="font-medium text-green-600">
                        -₹{couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'online_payment' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Online Payment Discount (5%)
                      </span>
                      <span className="font-medium text-green-600">
                        -₹{((calculateSubtotal() - couponDiscount) * 0.05).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                      {calculateSubtotal() > 5000 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹200`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-neutral-600">Tax (GST 3% inclusive)</span>
                    <span className="font-medium">
                      ₹
                      {(
                        ((calculateSubtotal() - couponDiscount) * 0.03) / 1.03
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-2.5 sm:pt-3">
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

                {/* Checkout Button */}
                {!selectedAddress ? (
                  <div className="mt-6 space-y-2">
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Add Address to Proceed
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      Please add a delivery address to continue
                    </p>
                  </div>
                ) : !deliveryAvailable ? (
                  <div className="mt-6 space-y-2">
                    <button
                      disabled
                      className="w-full bg-red-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Delivery Not Available
                    </button>
                    <p className="text-xs text-center text-red-600">
                      We don&apos;t deliver to this location yet
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderLoading}
                    className="w-full mt-6 bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 flex items-center justify-center gap-2"
                  >
                    {orderLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ₹${Math.round(
                        calculateTotal()
                      ).toLocaleString()}`
                    )}
                  </button>
                )}

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

      {/* Coupon Modal */}
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onSelectCoupon={handleSelectCouponFromModal}
        currentTotal={calculateSubtotal()}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressAdded={handleAddressAdded}
        currentUser={user}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={showOrderSuccess}
        onClose={async (navigateTo = "/") => {
          // If an event object was passed accidentally, normalize it
          if (navigateTo && typeof navigateTo === "object") {
            navigateTo = "/";
          }
          console.log(
            "Modal close requested - clearing cart and navigating to:",
            navigateTo
          );

          try {
            // Clear cart and reset state when user closes modal
            await clearCart();
            setAppliedCoupon(null);
            setCouponDiscount(0);
            setCouponCode("");
            console.log("✅ Cart cleared successfully");
          } catch (error) {
            console.error("❌ Error clearing cart:", error);
          }

          setShowOrderSuccess(false);

          // Navigate to specified page after clearing
          setTimeout(() => {
            window.location.href = navigateTo;
          }, 100);
        }}
        orderData={orderData}
      />

      {/* PayU Payment Modal */}
      {showPaymentModal && (orderData || pendingOrderPayload) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Complete Payment
              </h2>
              <p className="text-gray-600 mb-4">
                You will be redirected to PayU payment gateway
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              {orderData?.orderId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderData.orderId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-lg">
                  ₹
                  {(
                    orderData?.orderSummary?.total ||
                    pendingOrderPayload?.orderSummary?.total
                  )?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <PayUPayment
                orderId={
                  orderData?.orderId !== "PREPAY"
                    ? orderData?.orderId
                    : undefined
                }
                amount={
                  orderData?.orderSummary?.total ||
                  pendingOrderPayload?.orderSummary?.total
                }
                customerInfo={{
                  firstname:
                    user.firstName || user.name?.split(" ")[0] || "Customer",
                  lastname:
                    user.lastName ||
                    user.name?.split(" ").slice(1).join(" ") ||
                    "",
                  email: user.email,
                  phone: selectedAddress?.phone || user.phone || "0000000000",
                }}
                productInfo={`Cart Payment`}
                reference={user.id || user._id}
              />

              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  toast.info("Payment cancelled. You can retry from cart.");
                }}
                className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel Payment
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              🔒 Secure payment powered by PayU
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
