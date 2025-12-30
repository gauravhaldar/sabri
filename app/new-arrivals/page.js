"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useNewArrivals } from "../../hooks/useProducts";
import { useWishlist } from "../../contexts/WishlistContext";
import {
  getProductImageUrl,
  getProductHoverImageUrl,
  getProductDisplayPrice,
  isProductOnSale,
  filterProducts,
  sortProducts,
} from "../../lib/productUtils";

// Standalone ProductCard component
const ProductCard = ({ product, onAddToCart, visibleCount, onProductClick }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const {
    toggleWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onAddToCart(product);
    setIsAddingToCart(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    e.stopPropagation();

    if (!wishlistLoading) {
      await toggleWishlist(product._id || product.id);
    }
  };

  const isWishlisted = isInWishlist(product._id || product.id);

  // Use utility functions to get proper data
  const productImage = getProductImageUrl(product);
  const hoverImage = getProductHoverImageUrl(product);
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);

  return (
    <div className="bg-white group" data-product-id={product._id || product.id}>
      <div onClick={() => onProductClick(product)} className="block cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} hover`}
              fill
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="absolute bottom-2 left-2 p-1.5 bg-white/90 hover:bg-white rounded-full transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50"
          >
            <Heart
              className={`h-3 w-3 ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
            className={`absolute bottom-2 right-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 ${
              product.stock <= 0
                ? "bg-gray-400 text-white cursor-not-allowed border border-gray-400"
                : "bg-white border border-black text-black hover:bg-gray-50"
            }`}
          >
            {product.stock <= 0
              ? "SOLD OUT"
              : isAddingToCart
              ? "Adding..."
              : "ADD TO BAG"}
          </button>
          {isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
              {discount}% OFF
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1">
              OUT OF STOCK
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div onClick={() => onProductClick(product)} className="cursor-pointer">
          <h3 className="text-xs font-light text-black mb-1.5 line-clamp-2 leading-tight hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-light text-black">
            ₹{current.toLocaleString()}
          </span>
          {original > current && (
            <>
              <span className="text-xs text-gray-500 line-through font-light">
                ₹{original.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-light">
                ({discount}%)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const rating = Number(
                product.averageRating || product.rating?.average || 0
              );
              return (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              );
            })}
          </div>
          <span className="text-xs text-gray-500 font-light">
            (
            {(() => {
              const rating = Number(
                product.averageRating || product.rating?.average || 0
              );
              return isNaN(rating) ? 0 : rating.toFixed(1);
            })()}
            )
          </span>
        </div>
      </div>
    </div>
  );
};

export default function NewArrivalsPage() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 50000,
    minRating: 0,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const INITIAL_VISIBLE_COUNT = 12;
  const LOAD_MORE_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastProductId, setLastProductId] = useState(null);

  const { products, loading, error } = useNewArrivals();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  // Load saved scroll position and product on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('new-arrivals-scroll-position');
    const savedProductId = sessionStorage.getItem('new-arrivals-last-product');
    const savedVisibleCount = sessionStorage.getItem('new-arrivals-visible-count');
    const savedProducts = sessionStorage.getItem('new-arrivals-loaded-products');

    if (savedPosition) {
      setScrollPosition(parseInt(savedPosition));
    }
    if (savedProductId) {
      setLastProductId(savedProductId);
    }
    if (savedVisibleCount) {
      const count = parseInt(savedVisibleCount);
      setVisibleCount(count);
    }
    
    // Clear saved products data after loading
    if (savedProducts) {
      sessionStorage.removeItem('new-arrivals-loaded-products');
    }
  }, []);

  // Restore scroll position after products are loaded
  useEffect(() => {
    if (products.length > 0 && (scrollPosition > 0 || lastProductId)) {
      // If we have a specific product to scroll to
      if (lastProductId) {
        const productIndex = sortedProducts.findIndex(p => p._id === lastProductId || p.id === lastProductId);
        
        if (productIndex !== -1) {
          // Calculate how many items to show to include this product
          const itemsPerRow = 4; // Assuming 4 columns on desktop
          const rowsNeeded = Math.ceil((productIndex + 1) / itemsPerRow);
          const itemsNeeded = rowsNeeded * itemsPerRow;
          
          if (itemsNeeded > visibleCount) {
            setVisibleCount(Math.min(itemsNeeded, sortedProducts.length));
            
            // Scroll to the specific product after ensuring it's visible
            setTimeout(() => {
              const productElement = document.querySelector(`[data-product-id="${lastProductId}"]`);
              if (productElement) {
                productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (scrollPosition > 0) {
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              }
              
              // Clear saved state
              sessionStorage.removeItem('new-arrivals-last-product');
              sessionStorage.removeItem('new-arrivals-scroll-position');
              sessionStorage.removeItem('new-arrivals-visible-count');
              setLastProductId(null);
              setScrollPosition(0);
            }, 800);
          } else {
            // Product is already visible, scroll immediately
            setTimeout(() => {
              const productElement = document.querySelector(`[data-product-id="${lastProductId}"]`);
              if (productElement) {
                productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (scrollPosition > 0) {
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              }
              
              // Clear saved state
              sessionStorage.removeItem('new-arrivals-last-product');
              sessionStorage.removeItem('new-arrivals-scroll-position');
              sessionStorage.removeItem('new-arrivals-visible-count');
              setLastProductId(null);
              setScrollPosition(0);
            }, 500);
          }
        } else {
          // Fallback to scroll position if product not found
          setTimeout(() => {
            if (scrollPosition > 0) {
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              sessionStorage.removeItem('new-arrivals-scroll-position');
              setScrollPosition(0);
            }
            sessionStorage.removeItem('new-arrivals-last-product');
            setLastProductId(null);
          }, 500);
        }
      } else if (scrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          sessionStorage.removeItem('new-arrivals-scroll-position');
          setScrollPosition(0);
        }, 500);
      }
    }
  }, [products, sortedProducts, visibleCount, scrollPosition, lastProductId]);

  useEffect(() => {
    // Only reset if this is a new session (no saved state)
    const hasSavedState = sessionStorage.getItem('new-arrivals-scroll-position') || 
                         sessionStorage.getItem('new-arrivals-last-product') || 
                         sessionStorage.getItem('new-arrivals-visible-count') ||
                         sessionStorage.getItem('new-arrivals-loaded-products');
    
    if (!hasSavedState) {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }
  }, [sortBy, filters, products]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
  };

  const handleProductClick = (product) => {
    // Save current scroll position and product info before navigating
    sessionStorage.setItem('new-arrivals-scroll-position', window.scrollY.toString());
    sessionStorage.setItem('new-arrivals-last-product', product._id || product.id);
    sessionStorage.setItem('new-arrivals-visible-count', visibleCount.toString());
    
    // Save the actual loaded products data to prevent reloading
    const loadedProducts = sortedProducts.slice(0, visibleCount);
    sessionStorage.setItem('new-arrivals-loaded-products', JSON.stringify(loadedProducts));
    
    // Navigate to product page
    window.location.href = `/new-arrivals/${product.slug || product._id || product.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-64 sm:pb-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/gift.jpeg"
            alt="New Arrivals Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r"></div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center mt-18">
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm px-4 py-2 rounded-full font-medium tracking-wide">
               NEW ARRIVALS
            </span>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Category Header */}
      <div className="bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              New Arrivals
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {filteredProducts.length > 0 ? (
          <>
            {/* Filters Drawer + Sort */}
            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="px-3 py-2 border border-neutral-900 text-neutral-900 text-sm bg-white hover:bg-neutral-50 whitespace-nowrap"
              >
                Filters
              </button>
              <div className="flex items-center w-full sm:w-auto">
                <label className="mr-2 text-sm text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
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
            <FiltersDrawer
              open={filtersOpen}
              value={filters}
              onChange={setFilters}
              onClose={() => setFiltersOpen(false)}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  visibleCount={visibleCount}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < sortedProducts.length && (
              <div className="text-center mt-8 sm:mt-12">
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + LOAD_MORE_COUNT, sortedProducts.length)
                    )
                  }
                  className="bg-white border border-gray-300 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  Load More ({Math.max(sortedProducts.length - visibleCount, 0)}
                  )
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any products in this category.
            </p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
