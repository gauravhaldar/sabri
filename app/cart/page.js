"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Heart } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock cart data - replace with actual cart data from your state management
  useEffect(() => {
    const mockCartItems = [
      {
        id: "bs1",
        name: "Classic Gold Wedding Ring",
        price: 4599,
        originalPrice: 6599,
        discount: 30,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        quantity: 2,
        size: "Medium",
        category: "Best Sellers",
      },
      {
        id: "bs2", 
        name: "Diamond Solitaire Ring",
        price: 12999,
        originalPrice: 18999,
        discount: 32,
        image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        quantity: 1,
        size: "Large",
        category: "Best Sellers",
      },
    ];
    setCartItems(mockCartItems);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const moveToWishlist = (item) => {
    // Add to wishlist logic here
    console.log("Moved to wishlist:", item);
    removeItem(item.id);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      const originalTotal = item.originalPrice * item.quantity;
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
    setIsLoading(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Proceeding to checkout...");
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-neutral-50 py-8 pt-40">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Cart</h1>
              <p className="text-neutral-600">Your cart is empty</p>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
              <p className="text-neutral-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
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
          <Link href="/" className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Cart</h1>
            <p className="text-neutral-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/best-sellers/${item.id}`}>
                              <h3 className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-neutral-600 mt-1">{item.category}</p>
                            <p className="text-sm text-neutral-600">Size: {item.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
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
                            {item.originalPrice && (
                              <>
                                <span className="text-sm text-neutral-500 line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  {item.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-neutral-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-neutral-50 text-neutral-600"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-neutral-300 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-neutral-50 text-neutral-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200">
                          <span className="text-sm text-neutral-600">Item Total:</span>
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
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
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
                    <span className="font-medium">₹{(calculateSubtotal() * 0.18).toLocaleString()}</span>
                  </div>
                  
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">You Save</span>
                      <span className="font-medium text-green-600">₹{calculateSavings().toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-neutral-900">Total</span>
                      <span className="font-semibold text-neutral-900">₹{calculateTotal().toLocaleString()}</span>
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
                  disabled={isLoading}
                  className="w-full mt-6 bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                    Secure Checkout
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded border border-neutral-200 px-2 py-2">Free Shipping</div>
                  <div className="rounded border border-neutral-200 px-2 py-2">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
