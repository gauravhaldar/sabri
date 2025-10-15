"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  getProductImageUrl,
  getProductDisplayPrice,
  isProductOnSale,
} from "../../lib/productUtils";

export default function WishlistPage() {
  const { user } = useAuth();
  const {
    wishlistItems,
    wishlistCount,
    clearWishlist,
    removeFromWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [isClearing, setIsClearing] = useState(false);

  const handleAddToCart = async (productId) => {
    setIsAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      await addToCart(productId, 1);
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    setIsClearing(true);
    try {
      await clearWishlist();
    } finally {
      setIsClearing(false);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Please log in to view your wishlist
          </h1>
          <Link
            href="/signin"
            className="inline-block bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-40 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900">My Wishlist</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
            </p>
          </div>
          {wishlistCount > 0 && (
            <button
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistCount === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you love by clicking the heart icon
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Object.entries(wishlistItems).map(([productId, item]) => {
              const productImage = getProductImageUrl(item);
              const { current, original, discount } =
                getProductDisplayPrice(item);
              const isOnSale = isProductOnSale(item);
              const inCart = isInCart(productId);
              const addingToCart = isAddingToCart[productId];

              return (
                <div key={productId} className="bg-white group relative">
                  <Link
                    href={`/${item.category}/${item.slug || productId}`}
                    className="block"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={productImage}
                        alt={item.name}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      {isOnSale && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(productId)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full transition-all duration-200 shadow-sm opacity-100"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>

                  {/* Add to Cart Button */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleAddToCart(productId)}
                      disabled={addingToCart || inCart}
                      className="w-full bg-black text-white px-3 py-2 text-xs font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart
                        ? "Adding..."
                        : inCart
                        ? "In Cart"
                        : "Add to Cart"}
                    </button>
                  </div>

                  <div className="p-3 sm:p-4">
                    <Link href={`/${item.category}/${item.slug || productId}`}>
                      <h3 className="text-[13px] sm:text-sm font-light text-black mb-1.5 sm:mb-2 line-clamp-2 leading-tight hover:text-gray-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="text-[13px] sm:text-sm font-light text-black">
                        ₹{current.toLocaleString()}
                      </span>
                      {original > current && (
                        <>
                          <span className="text-[11px] sm:text-xs text-gray-500 line-through font-light">
                            ₹{original.toLocaleString()}
                          </span>
                          <span className="text-[11px] sm:text-xs text-green-600 font-light">
                            ({discount}%)
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(item.rating || 4.5)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[11px] sm:text-xs text-gray-500 ml-1">
                        ({item.rating || 4.5})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
