"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ShoppingBag, Trash2, Eye } from "lucide-react";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock wishlist data - replace with actual wishlist data from your state management
  useEffect(() => {
    const mockWishlistItems = [
      {
        id: "bs1",
        name: "Classic Gold Wedding Ring",
        price: 4599,
        originalPrice: 6599,
        discount: 30,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        category: "Best Sellers",
        rating: 5,
        reviews: 128,
        isOnSale: true,
        isBestSeller: true,
        addedDate: "2024-01-15",
        size: "Medium",
      },
      {
        id: "bs2", 
        name: "Diamond Solitaire Ring",
        price: 12999,
        originalPrice: 18999,
        discount: 32,
        image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        category: "Best Sellers",
        rating: 5,
        reviews: 95,
        isOnSale: true,
        isBestSeller: true,
        addedDate: "2024-01-10",
        size: "Large",
      },
      {
        id: "bs3",
        name: "Pearl Drop Earrings",
        price: 3299,
        originalPrice: 4599,
        discount: 28,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        category: "Best Sellers",
        rating: 4.8,
        reviews: 67,
        isOnSale: true,
        isBestSeller: true,
        addedDate: "2024-01-08",
        size: "One Size",
      },
    ];
    setWishlistItems(mockWishlistItems);
  }, []);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = async (item) => {
    setIsLoading(true);
    // Simulate adding to cart
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    console.log("Added to cart:", item);
    // You can add actual cart logic here
  };

  const moveAllToCart = async () => {
    setIsLoading(true);
    // Simulate adding all items to cart
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Added all items to cart");
    // You can add actual cart logic here
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };


  if (wishlistItems.length === 0) {
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
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Wishlist</h1>
              <p className="text-neutral-600">Your wishlist is empty</p>
            </div>
          </div>
        </div>

        {/* Empty Wishlist */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <Heart className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your wishlist is empty</h2>
              <p className="text-neutral-600 mb-6">Save items you love by adding them to your wishlist.</p>
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Wishlist</h1>
            <p className="text-neutral-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Wishlist Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={moveAllToCart}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
                {isLoading ? "Adding..." : "Add All to Cart"}
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link href={`/best-sellers/${item.id}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isOnSale && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.discount}% OFF
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        BEST SELLER
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                    <Link
                      href={`/best-sellers/${item.id}`}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
                    >
                      <Eye className="w-3 h-3 text-neutral-600" />
                    </Link>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={isLoading}
                      className="w-full bg-white border border-neutral-900 text-neutral-900 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 shake-attention"
                    >
                      {isLoading ? "Adding..." : "ADD TO BAG"}
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <Link href={`/best-sellers/${item.id}`}>
                    <h3 className="text-sm font-medium text-neutral-900 mb-2 line-clamp-2 hover:text-neutral-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({item.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-neutral-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <>
                        <span className="text-xs text-neutral-500 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-green-600">
                          ({item.discount}%)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Size */}
                  <div className="text-xs text-neutral-600 mb-2">
                    Size: {item.size}
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-neutral-500">
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 text-center">
            <Link 
              href="/best-sellers"
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Recently Viewed Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mock recently viewed items */}
              {[
                {
                  id: "rv1",
                  name: "Gold Chain Necklace",
                  price: 5999,
                  originalPrice: 8999,
                  discount: 33,
                  image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
                },
                {
                  id: "rv2",
                  name: "Silver Hoop Earrings",
                  price: 2499,
                  originalPrice: 3499,
                  discount: 29,
                  image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
                },
              ].map((item) => (
                <Link key={item.id} href={`/best-sellers/${item.id}`} className="group">
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-neutral-500 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
