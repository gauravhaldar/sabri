"use client";
/* eslint react/no-unescaped-entities: "off" */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useBracelets } from "../../hooks/useProducts";
import { useWishlist } from "../../contexts/WishlistContext";
import {
  getProductImageUrl,
  getProductHoverImageUrl,
  getProductDisplayPrice,
  isProductOnSale,
  filterProducts,
  sortProducts,
} from "../../lib/productUtils";

const FAQS = [
  {
    question:
      "How do I choose the best pure silver bracelet for men within my budget?",
    answer:
      "Look for 925 sterling silver bracelets for men, since they provide the ideal mix of quality and cost. Simple chain designs are inexpensive, while engraved or patterned bracelets are excellent luxury options.",
  },
  {
    question: "Are pure silver bracelets for men good for gifting?",
    answer:
      "Yes! Pure silver bracelets for men make timeless, elegant gifts suitable for birthdays, anniversaries, festivals, and corporate gifting. They are durable, stylish, and hold sentimental value.",
  },
  {
    question:
      "How can I check if a man’s silver bracelet is real 925 sterling silver?",
    answer:
      "Genuine 925 silver bracelets for men have the '925' or 'S925' certification. Authentic dealers also supply weight information, hallmarking details, and certifications of purity.",
  },
  {
    question: "What is the price range for pure silver bracelets for men?",
    answer:
      "Prices vary by design and weight. Minimal chain bracelets are affordable, while thick cuffs, designer pieces, or oxidised bracelets are more expensive. There is a suitable option for every budget.",
  },
  {
    question:
      "Are 925 sterling silver bracelets safe for daily wear for men?",
    answer:
      "Absolutely. 925 silver bracelets for men are skin-friendly, durable, and resistant to tarnish when maintained properly. They are ideal for everyday use.",
  },
];

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

  const productImage = getProductImageUrl(product);
  const hoverImage = getProductHoverImageUrl(product);
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);
  const rating = Number(product.averageRating || product.rating?.average || 0);

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
            {[...Array(5)].map((_, i) => (
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
            ))}
          </div>
          <span className="text-xs text-gray-500 font-light">
            ({isNaN(rating) ? 0 : rating.toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BraceletsPage() {
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
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);
  const [showMore4, setShowMore4] = useState(false);
  const [showMore5, setShowMore5] = useState(false);
  const [showMore6, setShowMore6] = useState(false);
  const [showMore7, setShowMore7] = useState(false);
  const [showMore8, setShowMore8] = useState(false);

  const { products, loading, error } = useBracelets();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Load saved scroll position and product on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('bracelets-scroll-position');
    const savedProductId = sessionStorage.getItem('bracelets-last-product');
    const savedVisibleCount = sessionStorage.getItem('bracelets-visible-count');
    const savedProducts = sessionStorage.getItem('bracelets-loaded-products');

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
      sessionStorage.removeItem('bracelets-loaded-products');
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
              sessionStorage.removeItem('bracelets-last-product');
              sessionStorage.removeItem('bracelets-scroll-position');
              sessionStorage.removeItem('bracelets-visible-count');
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
              sessionStorage.removeItem('bracelets-last-product');
              sessionStorage.removeItem('bracelets-scroll-position');
              sessionStorage.removeItem('bracelets-visible-count');
              setLastProductId(null);
              setScrollPosition(0);
            }, 500);
          }
        } else {
          // Fallback to scroll position if product not found
          setTimeout(() => {
            if (scrollPosition > 0) {
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              sessionStorage.removeItem('bracelets-scroll-position');
              setScrollPosition(0);
            }
            sessionStorage.removeItem('bracelets-last-product');
            setLastProductId(null);
          }, 500);
        }
      } else if (scrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          sessionStorage.removeItem('bracelets-scroll-position');
          setScrollPosition(0);
        }, 500);
      }
    }
  }, [products, sortedProducts, visibleCount, scrollPosition, lastProductId]);

  useEffect(() => {
    // Only reset if this is a new session (no saved state)
    const hasSavedState = sessionStorage.getItem('bracelets-scroll-position') || 
                         sessionStorage.getItem('bracelets-last-product') || 
                         sessionStorage.getItem('bracelets-visible-count') ||
                         sessionStorage.getItem('bracelets-loaded-products');
    
    if (!hasSavedState) {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }
  }, [sortBy, filters, products]);

  const handleProductClick = (product) => {
    // Save current scroll position and product info before navigating
    sessionStorage.setItem('bracelets-scroll-position', window.scrollY.toString());
    sessionStorage.setItem('bracelets-last-product', product._id || product.id);
    sessionStorage.setItem('bracelets-visible-count', visibleCount.toString());
    
    // Save the actual loaded products data to prevent reloading
    const loadedProducts = sortedProducts.slice(0, visibleCount);
    sessionStorage.setItem('bracelets-loaded-products', JSON.stringify(loadedProducts));
    
    // Navigate to product page
    window.location.href = `/bracelets/${product.slug || product._id || product.id}`;
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
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
      <Head>
        <title>
          Pure Silver Bracelet for Men’s | 925 Silver Bracelets Online
        </title>
        <meta
          name="description"
          content="Shop pure silver bracelet for mens online at Mysabri. Explore 925 silver bracelet for men designs with affordable prices, premium quality, and long-lasting durability. Buy now!"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-64 sm:pb-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/bracelet.jpeg"
            alt="Bracelets Banner"
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
               BRACELETS
            </span>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              Bracelets
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

           {/* SEO Section with Zig-Zag Format - Matching Earrings Page Design */}
      <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-50/30 py-12 sm:py-20 lg:py-28 font-sans text-neutral-800">
        <div className="w-full px-4 sm:px-6 lg:px-16">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide text-neutral-900 mb-4">
              Pure Silver Bracelet for Men
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Intro Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-100">
            <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
              At Mysabri, we offer exquisite pure silver bracelet for men, crafted to blend timeless elegance, exceptional craftsmanship, and modern sophistication. Our curated collection features stunning 925 sterling silver bracelets, as well as beautifully designed pure silver bracelets, all created with meticulous attention to detail. Whether you're seeking graceful chain bracelets for daily wear or bold statement pieces for special occasions, we have something for every style. From classic designs to contemporary patterns, our sterling silver bracelets are designed to complement every personality, outfit, and moment.
            </p>
          </div>

          {/* Zig-zag Content Sections */}
          <div className="space-y-16 sm:space-y-24">
              {/* Section 1 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Elegant 925 Sterling Silver Bracelets – Timeless Beauty for Modern Men
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Discover the perfect blend of elegance and craftsmanship with Mysabri's exquisite pure silver bracelet for men. Each piece is meticulously crafted from genuine 925 sterling silver, ensuring lasting shine, durability, and comfort for everyday wear.
                    </p>
                    {!showMore1 && (
                      <button
                        type="button"
                        onClick={() => setShowMore1(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore1 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our collection features everything from delicate chains to bold cuffs, each designed to complement your unique style. Whether you're dressing up for a special occasion or adding sophistication to your daily look, these silver bracelets offer the perfect balance of masculinity and elegance.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore1(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b9.png" 
                      alt="925 sterling silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 - Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Chain Silver Bracelets for Men – Classic Designs for Daily Wear
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Elevate your everyday style with our classic chain silver bracelets. These timeless designs feature intricate linking patterns and lightweight construction, making them perfect for office wear, casual outings, and daily use where you want to make a sophisticated statement.
                    </p>
                    {!showMore2 && (
                      <button
                        type="button"
                        onClick={() => setShowMore2(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore2 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          From delicate link chains to bold rope designs, our chain silver bracelets are designed to complement both traditional and modern outfits. Each piece is crafted with precision to ensure comfort even during extended wear, while maintaining its brilliant shine.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore2(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b6.png" 
                      alt="Chain silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Heavy Silver Bracelets – Bold Statement Pieces
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Make a powerful style statement with our heavy silver bracelets. These substantial pieces feature robust construction and bold designs, perfect for men who appreciate distinctive accessories that command attention and showcase confidence.
                    </p>
                    {!showMore3 && (
                      <button
                        type="button"
                        onClick={() => setShowMore3(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore3 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our heavy bracelet collection includes thick chain designs, wide cuff styles, and substantial link patterns that exude masculinity and strength. Each piece is carefully balanced to provide impressive presence without compromising on comfort or wearability.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore3(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b5.png" 
                      alt="Heavy silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4 - Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Oxidized Silver Bracelets – Traditional Charm with Contemporary Flair
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Embrace the rich heritage of Indian jewelry with our oxidized silver bracelets. These pieces feature darkened silver backgrounds that highlight intricate patterns and traditional motifs, perfect for ethnic wear and cultural celebrations.
                    </p>
                    {!showMore4 && (
                      <button
                        type="button"
                        onClick={() => setShowMore4(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore4 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our oxidized collection includes tribal-inspired designs, traditional patterns, and contemporary interpretations of classic motifs. These silver bracelets pair beautifully with traditional outfits and fusion wear, adding an authentic touch of Indian craftsmanship to your look.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore4(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b1.png" 
                      alt="Oxidized silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Beaded Silver Bracelets – Modern Style with Natural Elements
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Combine contemporary fashion with natural beauty using our beaded silver bracelets. These unique designs feature precious silver elements combined with carefully selected beads, creating versatile pieces that transition seamlessly from casual to formal settings.
                    </p>
                    {!showMore5 && (
                      <button
                        type="button"
                        onClick={() => setShowMore5(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore5 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our beaded collection includes designs with semi-precious stones, wooden accents, and ceramic elements that add texture and visual interest. Each bracelet is carefully crafted to ensure durability while maintaining the sophisticated appeal of sterling silver.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore5(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b2.png" 
                      alt="Beaded silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6 - Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Designer Silver Bracelets – Luxury Craftsmanship for Discerning Men
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Experience the pinnacle of elegance with our designer silver bracelets collection. Each piece showcases exceptional craftsmanship, featuring premium materials, intricate detailing, and innovative designs that cater to the sophisticated tastes of modern men.
                    </p>
                    {!showMore6 && (
                      <button
                        type="button"
                        onClick={() => setShowMore6(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore6 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our designer collection includes limited edition pieces, gemstone-studded creations, and avant-garde designs that push the boundaries of traditional silver jewelry. These exclusive silver bracelets are perfect for making a statement at high-end events and special occasions.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore6(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b0.png" 
                      alt="Designer silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Engraved Silver Bracelets – Personalized Style with Meaning
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Add a personal touch to your accessory collection with our engraved silver bracelets. These meaningful pieces can be customized with names, dates, or special messages, making them perfect for gifts and personal expression.
                    </p>
                    {!showMore7 && (
                      <button
                        type="button"
                        onClick={() => setShowMore7(true)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read more
                      </button>
                    )}
                    {showMore7 && (
                      <div className="space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                          Our engraved collection includes traditional patterns, modern typography, and symbolic designs that can be personalized to your preferences. Each bracelet becomes a unique piece of jewelry that tells your story and holds sentimental value.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMore7(false)}
                          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                        >
                          Read less
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                    <Image 
                      src="/seo/b7.png" 
                      alt="Engraved silver bracelets for men"
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Section 8 - Image Left, Content Right */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Adjustable Silver Bracelets – Perfect Fit for Every Wrist
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Enjoy maximum comfort and versatility with our adjustable silver bracelets. These thoughtfully designed pieces feature extendable chains or flexible mechanisms that ensure the perfect fit for any wrist size, making them ideal for gifting and personal wear.
                  </p>
                  {!showMore8 && (
                    <button
                      type="button"
                      onClick={() => setShowMore8(true)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read more
                    </button>
                  )}
                  {showMore8 && (
                    <div className="space-y-4">
                      <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                        Our adjustable collection includes chain bracelets with extension links, cuff designs with flexible openings, and innovative mechanisms that allow for easy sizing adjustments. These practical yet stylish pieces ensure comfort without compromising on the sophisticated appeal of sterling silver.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowMore8(false)}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                      >
                        Read less
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                  <Image 
                    src="/seo/b8.png" 
                    alt="Adjustable silver bracelets for men"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mt-20 sm:mt-32">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 mb-4">
                FAQs – Pure Silver Bracelet for Men
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              {FAQS.map((faq, index) => (
                <div
                  key={faq.question}
                  className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-amber-50/50 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-neutral-900 pr-4">
                      {faq.question}
                    </span>
                    <span className="text-lg leading-none text-amber-600 font-bold">
                      {openFaqIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-neutral-700 bg-white/50 border-t border-amber-100/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
