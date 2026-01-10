"use client";
/* eslint react/no-unescaped-entities: "off" */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useEarrings } from "../../hooks/useProducts";
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
      "Are Mysabri's silver earrings for women made from real 925 sterling silver?",
    answer:
      "Yes, all Mysabri silver earrings are made of genuine 925 sterling silver, which guarantees long-lasting lustre, durability, and skin-friendly comfort. Every item is meticulously created to ensure quality and purity.",
  },
  {
    question:
      "Which silver earrings are best for women who love everyday wear?",
    answer:
      "For everyday use, our silver earrings for women, including stud earrings, petite hoops, and simple drop designs, are suitable. They are lightweight, comfy, and suitable for both formal and informal attire.",
  },
  {
    question:
      "Do you offer long silver earrings for women suitable for parties or weddings?",
    answer:
      "Absolutely! Mysabri has a beautiful collection of long silver earrings for women that are perfect for festive events, weddings, and evening parties. These earrings add elegance and beautifully frame your face.",
  },
  {
    question:
      "Are sterling silver earrings safe for girls with sensitive ears?",
    answer:
      "Our sterling silver earrings for women are hypoallergenic and suitable for delicate skin. Made of pure 925 sterling silver, they provide comfort, lustre, and irritation-free usage, making them ideal for daily use.",
  },
  {
    question:
      "What are the most popular silver earring designs available at Mysabri?",
    answer:
      "Stud earrings, hoop earrings, long drop earrings, and trendy oxidised designs are some of our most popular types. These silver earrings are popular among both ladies and girls because of their elegance, adaptability, and superior polish.",
  },
];

const ProductCard = ({ product, onAddToCart, onProductClick, visibleCount }) => {
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

  const handleProductClick = () => {
    // Save current scroll position and product info before navigating
    sessionStorage.setItem('earrings-scroll-position', window.scrollY.toString());
    sessionStorage.setItem('earrings-last-product', product._id || product.id);
    sessionStorage.setItem('earrings-visible-count', visibleCount.toString());
    
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const productImage = getProductImageUrl(product);
  const hoverImage = getProductHoverImageUrl(product);
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);
  const rating = Number(product.averageRating || product.rating?.average || 0);

  return (
    <div className="bg-white group" data-product-id={product._id || product.id}>
      <div onClick={handleProductClick} className="block cursor-pointer">
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
        <div onClick={handleProductClick} className="cursor-pointer">
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

export default function EarringsPage() {
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

  const { products, loading, error } = useEarrings();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Load saved scroll position and product on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('earrings-scroll-position');
    const savedProductId = sessionStorage.getItem('earrings-last-product');
    const savedVisibleCount = sessionStorage.getItem('earrings-visible-count');
    const savedProducts = sessionStorage.getItem('earrings-loaded-products');

    console.log('=== RESTORE: Loading saved state ===');
    console.log('Saved position:', savedPosition);
    console.log('Saved product ID:', savedProductId);
    console.log('Saved visible count:', savedVisibleCount);
    console.log('Saved products data:', savedProducts ? 'Yes' : 'No');

    if (savedPosition) {
      setScrollPosition(parseInt(savedPosition));
    }
    if (savedProductId) {
      setLastProductId(savedProductId);
    }
    if (savedVisibleCount) {
      const count = parseInt(savedVisibleCount);
      console.log('=== RESTORE: Setting visible count to:', count);
      setVisibleCount(count);
    }
    
    // Clear saved products data after loading
    if (savedProducts) {
      sessionStorage.removeItem('earrings-loaded-products');
    }
  }, []);

  // Restore scroll position after products are loaded
  useEffect(() => {
    console.log('=== RESTORE: Checking restoration conditions ===');
    console.log('Products loaded:', products.length);
    console.log('Scroll position:', scrollPosition);
    console.log('Last product ID:', lastProductId);
    console.log('Current visible count:', visibleCount);
    console.log('Sorted products length:', sortedProducts.length);

    if (products.length > 0 && (scrollPosition > 0 || lastProductId)) {
      console.log('=== RESTORE: Starting restoration process ===');
      
      // If we have a specific product to scroll to
      if (lastProductId) {
        console.log('=== RESTORE: Looking for product:', lastProductId);
        const productIndex = sortedProducts.findIndex(p => p._id === lastProductId || p.id === lastProductId);
        console.log('=== RESTORE: Product index found:', productIndex);
        
        if (productIndex !== -1) {
          // Calculate how many items to show to include this product
          const itemsPerRow = 4; // Assuming 4 columns on desktop
          const rowsNeeded = Math.ceil((productIndex + 1) / itemsPerRow);
          const itemsNeeded = rowsNeeded * itemsPerRow;
          console.log('=== RESTORE: Items needed:', itemsNeeded);
          
          if (itemsNeeded > visibleCount) {
            console.log('=== RESTORE: Setting visible count to:', Math.min(itemsNeeded, sortedProducts.length));
            setVisibleCount(Math.min(itemsNeeded, sortedProducts.length));
            
            // Scroll to the specific product after ensuring it's visible
          setTimeout(() => {
            console.log('=== RESTORE: Attempting to scroll to product after count update');
            const productElement = document.querySelector(`[data-product-id="${lastProductId}"]`);
            if (productElement) {
              productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              console.log('=== RESTORE: Scrolled to product element smoothly');
            } else if (scrollPosition > 0) {
              console.log('=== RESTORE: Product element not found, using scroll position');
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }
            
            // Clear saved state
            sessionStorage.removeItem('earrings-last-product');
            sessionStorage.removeItem('earrings-scroll-position');
            sessionStorage.removeItem('earrings-visible-count');
            setLastProductId(null);
            setScrollPosition(0);
          }, 800); // Increased delay to ensure DOM updates
          } else {
            // Product is already visible, scroll immediately
            setTimeout(() => {
              console.log('=== RESTORE: Product already visible, scrolling immediately');
              const productElement = document.querySelector(`[data-product-id="${lastProductId}"]`);
              if (productElement) {
                productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('=== RESTORE: Scrolled to product element smoothly');
              } else if (scrollPosition > 0) {
                console.log('=== RESTORE: Product element not found, using scroll position');
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              }
              
              // Clear saved state
              sessionStorage.removeItem('earrings-last-product');
              sessionStorage.removeItem('earrings-scroll-position');
              sessionStorage.removeItem('earrings-visible-count');
              setLastProductId(null);
              setScrollPosition(0);
            }, 500);
          }
        } else {
          console.log('=== RESTORE: Product not found, using scroll position');
          // Fallback to scroll position if product not found
          setTimeout(() => {
            if (scrollPosition > 0) {
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              sessionStorage.removeItem('earrings-scroll-position');
              setScrollPosition(0);
            }
            sessionStorage.removeItem('earrings-last-product');
            setLastProductId(null);
          }, 500);
        }
      } else if (scrollPosition > 0) {
        console.log('=== RESTORE: Using scroll position only');
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          sessionStorage.removeItem('earrings-scroll-position');
          setScrollPosition(0);
        }, 500);
      }
    }
  }, [products, sortedProducts, visibleCount, scrollPosition, lastProductId]);

  useEffect(() => {
    // Only reset if this is a new session (no saved state)
    const hasSavedState = sessionStorage.getItem('earrings-scroll-position') || 
                         sessionStorage.getItem('earrings-last-product') || 
                         sessionStorage.getItem('earrings-visible-count') ||
                         sessionStorage.getItem('earrings-loaded-products');
    
    console.log('=== RESET: Checking if should reset ===');
    console.log('Has saved state:', !!hasSavedState);
    
    if (!hasSavedState) {
      console.log('=== RESET: Resetting to initial count ===');
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }
  }, [sortBy, filters, products]);

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
          Buy Silver Earrings for women at 999 | 925 Sterling, Stud & Hoop
        </title>
        <meta
          name="description"
          content="Elegant Silver Earrings for Women at MySabri. Shop the best 925 sterling silver Earrings, studs, drop & hoop designs crafted to add sparkle to every occasion at 999/-"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-16 sm:pt-32 pb-24 sm:pb-72 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/earrings-ban.png"
            alt="Earrings Banner"
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
               EARRINGS
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
              Earrings
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
                  onProductClick={(product) => {
                    // Save the actual loaded products data to prevent reloading
                    const loadedProducts = sortedProducts.slice(0, visibleCount);
                    sessionStorage.setItem('earrings-loaded-products', JSON.stringify(loadedProducts));
                    window.location.href = `/earrings/${product.slug || product.id}`;
                  }}
                  visibleCount={visibleCount}
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

           {/* SEO Section with Zig-Zag Format - Matching Rings Page Design */}
      <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-50/30 py-12 sm:py-20 lg:py-28 font-sans text-neutral-800">
        <div className="w-full px-4 sm:px-6 lg:px-16">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide text-neutral-900 mb-4">
              Silver Earrings for Women
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Intro Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-100">
            <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
              At Mysabri, we offer exquisite silver earrings for women, crafted to blend timeless elegance, exceptional craftsmanship, and modern sophistication. Our curated collection features stunning 925 sterling silver earrings, as well as beautifully designed pure silver earrings, all created with meticulous attention to detail. Whether you're seeking graceful long silver earrings for special occasions or elegant studs for daily wear, we have something for every style. From delicate hoops to intricate drop designs, our sterling silver earrings are designed to complement every mood, outfit, and moment.
            </p>
          </div>

          {/* Zig-zag Content Sections */}
          <div className="space-y-16 sm:space-y-24">
              {/* Section 1 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Elegant 925 Sterling Silver Earrings – Timeless Beauty for Modern Women
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Discover the perfect blend of elegance and craftsmanship with Mysabri's exquisite silver earrings for women. Each pair is meticulously crafted from genuine 925 sterling silver, ensuring lasting shine, durability, and comfort for everyday wear.
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
                          Our collection features everything from delicate studs to dramatic drops, each designed to complement your unique style. Whether you're dressing up for a special occasion or adding sparkle to your daily look, these silver earrings offer the perfect balance of sophistication and versatility.
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
                      src="/seo/er1.png" 
                      alt="925 sterling silver earrings for women"
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
                    Long Silver Earrings for Women – Graceful Designs for Special Occasions
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Elevate your festive and party looks with our stunning long silver earrings. These elegant designs feature intricate detailing and lightweight construction, making them perfect for weddings, celebrations, and evening events where you want to make a graceful statement.
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
                          From cascading chandeliers to elegant drops, our long silver earrings are designed to draw attention to your facial features and complement traditional Indian attire as well as modern outfits. Each piece is crafted with precision to ensure comfort even during extended wear.
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
                      src="/seo/er2.png" 
                      alt="Long silver earrings for women"
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
                    Silver Stud Earrings – Perfect for Everyday Elegance
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Our silver stud earrings offer the perfect combination of simplicity and sophistication. Ideal for daily wear, office meetings, and casual outings, these versatile pieces provide just the right amount of sparkle without overwhelming your look.
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
                          Available in various shapes and sizes, from classic round studs to contemporary geometric designs, these silver earrings are hypoallergenic and comfortable for all-day wear. Their timeless appeal makes them essential additions to any jewelry collection.
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
                      src="/seo/er3.png" 
                      alt="Silver stud earrings for women"
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
                    Silver Hoop Earrings – Classic Style with Modern Appeal
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Add a touch of contemporary charm to your ensemble with our silver hoop earrings. Available in various sizes from subtle small hoops to bold statement pieces, these versatile earrings transition seamlessly from casual daywear to elegant evening looks.
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
                          Our collection includes classic polished hoops, textured designs, and embellished styles that add visual interest. These silver earrings are lightweight yet impactful, making them perfect for women who appreciate both comfort and style in their accessories.
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
                      src="/seo/er4.png" 
                      alt="Silver hoop earrings for women"
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
                    Drop Silver Earrings – Elegant Designs for Every Face Shape
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Our drop silver earrings feature graceful designs that elongate and complement your facial features. Perfect for both traditional and modern outfits, these versatile pieces add sophistication to any occasion while maintaining comfortable wearability.
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
                          From subtle teardrops to elaborate cascading designs, our drop earrings showcase the perfect balance between traditional Indian craftsmanship and contemporary aesthetics. Each piece is designed to move gracefully with you, creating an eye-catching yet elegant effect.
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
                      src="/seo/er5.png" 
                      alt="Drop silver earrings for women"
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
                    Sterling Silver Earrings for Girls – Safe and Stylish Choices
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Introduce your young ones to the elegance of silver with our specially designed earrings for girls. Crafted from hypoallergenic 925 sterling silver, these pieces ensure safety without compromising on style, making them perfect for school, parties, and special occasions.
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
                          Our collection features age-appropriate designs including cute studs, small hoops, and playful motifs that appeal to young fashion enthusiasts. Each pair is lightweight and secure, providing peace of mind for parents while allowing girls to express their personal style.
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
                      src="/seo/er6.png" 
                      alt="Sterling silver earrings for girls"
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
                    Oxidized Silver Earrings – Traditional Charm with Contemporary Flair
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Embrace the rich heritage of Indian jewelry with our oxidized silver earrings. These pieces feature darkened silver backgrounds that highlight intricate patterns and traditional motifs, perfect for ethnic wear and cultural celebrations.
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
                          Our oxidized collection includes jhumkas, tribal-inspired designs, and contemporary interpretations of traditional patterns. These silver earrings pair beautifully with sarees, kurtis, and fusion outfits, adding an authentic touch of Indian craftsmanship to your look.
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
                      src="/seo/er7.png" 
                      alt="Oxidized silver earrings for women"
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
                  Designer Silver Earrings – Luxury Craftsmanship for Discerning Women
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Experience the pinnacle of elegance with our designer silver earrings collection. Each piece showcases exceptional craftsmanship, featuring premium materials, intricate detailing, and innovative designs that cater to the sophisticated tastes of modern women.
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
                        Our designer collection includes limited edition pieces, gemstone-studded creations, and avant-garde designs that push the boundaries of traditional silver jewelry. These exclusive silver earrings are perfect for making a statement at high-end events and special occasions.
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
                    src="/seo/er8.png" 
                    alt="Designer silver earrings for women"
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
                FAQs – Silver Earrings for Women
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
