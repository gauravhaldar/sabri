"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";

const products = [
  {
    id: "bs1",
    name: "Classic Gold Wedding Ring",
    price: 4599,
    originalPrice: 6599,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Best Sellers",
    isOnSale: true,
    isBestSeller: true,
    rating: 5,
    description: "Timeless classic gold wedding ring",
  },
  {
    id: "bs2",
    name: "Diamond Solitaire Ring",
    price: 12999,
    originalPrice: 18999,
    discount: 32,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
      hoverImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Best Sellers",
    isOnSale: true,
    isBestSeller: true,
    rating: 5,
    description: "Elegant diamond solitaire ring",
  },
  {
    id: "bs3",
    name: "Pearl Drop Earrings",
    price: 3299,
    originalPrice: 4599,
    discount: 28,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
      hoverImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Best Sellers",
    isOnSale: true,
    isBestSeller: true,
    rating: 4.8,
    description: "Sophisticated pearl drop earrings",
  },
  {
    id: "bs4",
    name: "Gold Chain Necklace",
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
      hoverImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Best Sellers",
    isOnSale: true,
    isBestSeller: true,
    rating: 4.9,
    description: "Luxurious gold chain necklace",
  },
];

const ProductCard = ({ product, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onAddToCart(product);
    setIsAddingToCart(false);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Global smooth zoom and crossfade
  const baseImgClass = "object-cover transform-gpu will-change-[transform,opacity] select-none pointer-events-none group-hover:opacity-0 group-hover:scale-[1.10]";

  const hoverImgClass = "object-cover opacity-0 transform-gpu will-change-[transform,opacity] select-none pointer-events-none group-hover:opacity-100 group-hover:scale-[1.10]";

  const baseImgStyle = { transform: "scale(1)", transformOrigin: "50% 50%", backfaceVisibility: "hidden", transition: "transform 1600ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms, opacity 700ms cubic-bezier(0.33, 1, 0.68, 1) 200ms" };

  // Start hover image slightly pre-zoomed for continuous zoom feel
  const hoverImgStyle = { transform: "scale(1)", transformOrigin: "50% 50%", backfaceVisibility: "hidden", transition: "transform 1600ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms, opacity 700ms cubic-bezier(0.33, 1, 0.68, 1) 200ms" };

  return (
    <div className="bg-white group">
      <Link href={`/best-sellers/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={baseImgClass}
            style={baseImgStyle}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={`${product.name} hover`}
              fill
              className={hoverImgClass}
              style={hoverImgStyle}
            />
          )}
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 left-2 p-1.5 bg-white/90 hover:bg-white rounded-full transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <Heart
              className={`h-3 w-3 ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-2 right-2 bg-white border border-black text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            {isAddingToCart ? "Adding..." : "ADD TO BAG"}
          </button>
          {product.isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
              {product.discount}% OFF
            </div>
          )}
          {product.isBestSeller && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1">
              BEST SELLER
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/best-sellers/${product.id}`}>
          <h3 className="text-xs font-light text-black mb-1.5 line-clamp-2 leading-tight hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-light text-black">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-500 line-through font-light">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-light">
                ({product.discount}%)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
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
          <span className="text-xs text-gray-500 font-light">
            ({product.rating || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BestSellersPage() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured"); // featured | price-asc | price-desc
  const [filters, setFilters] = useState({ priceMin: "", priceMax: "", onSale: false, minRating: 0 });
  const baseProducts = products.filter((product) => product.category === "Best Sellers");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filteredProducts = baseProducts.filter((p) => {
    if (filters.onSale && !p.isOnSale) return false;
    if (filters.minRating && (p.rating || 0) < filters.minRating) return false;
    if (filters.priceMin !== "" && (p.price || 0) < Number(filters.priceMin)) return false;
    if (filters.priceMax !== "" && (p.price || 0) > Number(filters.priceMax)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === "price-desc") {
      return (b.price || 0) - (a.price || 0);
    }
    // featured: keep original order
    return 0;
  });

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">Best Sellers</h1>
            <p className="text-gray-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <>
            {/* Filters Drawer + Sort */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button onClick={() => setFiltersOpen(true)} className="px-3 py-2 border border-neutral-900 text-neutral-900 text-sm bg-white hover:bg-neutral-50 whitespace-nowrap">Filters</button>
              <div className="flex items-center w-full sm:w-auto">
                <label className="mr-2 text-sm text-gray-700 whitespace-nowrap">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 text-sm px-2 py-2 bg-white text-gray-900 w-full sm:w-auto min-w-0"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
              </div>
            </div>
            <FiltersDrawer open={filtersOpen} value={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 hover:bg-gray-50 transition-colors duration-200">
                Load More
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products in this category.
            </p>
            <a
              href="/"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
