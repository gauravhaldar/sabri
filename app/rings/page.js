"use client";
/* eslint react/no-unescaped-entities: "off" */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useRings } from "../../hooks/useProducts";
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
      "Are Mysabri's silver rings for women made from real 925 sterling silver?",
    answer:
      "Yes. All Mysabri silver rings for women are handmade from 925 sterling silver, assuring genuine purity and a long-lasting lustre. Each piece is high-quality and made to last through regular wear.",
  },
  {
    question: "Are silver rings for women suitable for daily wear?",
    answer:
      "Yes, silver rings for women are perfect for daily wear because they are lightweight, skin-friendly, and durable. Sterling silver maintains its shine with simple care and pairs well with any outfit.",
  },
  {
    question: "What is the best silver ring design for women at Mysabri?",
    answer:
      "Mysabri offers a wide range of silver ring designs for women, from simple everyday bands to statement and engagement styles. Each design is inspired by modern trends and Indian craftsmanship, making every piece elegant and timeless.",
  },
  {
    question: "Do you have silver thumb and toe rings for women?",
    answer:
      "Absolutely. Mysabri's collection includes silver thumb rings for women that represent confidence and originality, as well as silver toe rings for women fashioned from pure 925 silver, which are suitable for both classic and modern appearances.",
  },
  {
    question: "How do I choose the right size for silver rings for women?",
    answer:
      "To choose the right size for silver rings for women, measure your finger using a ring sizer or compare with a well-fitting ring you already own. Most brands, including Mysabri, also offer adjustable designs for a perfect fit.",
  },
  {
    question: "What is the pricing range for a Mysabri silver ring for women?",
    answer:
      "Our silver ring for women's price range is intended to be economical without sacrificing quality. Elegant 925 silver rings start at a reasonable price and are all made of pure sterling silver with handmade craftsmanship.",
  },
  {
    question: "Do silver rings for women tarnish over time?",
    answer:
      "Real sterling silver rings for women may develop slight tarnish due to natural oxidation, but it can be easily cleaned with a silver polishing cloth or mild soap solution. Proper storage keeps them shining longer.",
  },
  {
    question:
      "Are Mysabri's engagement silver rings for women appropriate for everyday wear?",
    answer:
      "Yes, Mysabri's silver engagement rings for women are meant to be both comfortable and long-lasting. They are made of genuine 925 sterling silver, which is skin-friendly, tarnish-resistant, and suitable for both everyday and exceptional events.",
  },
];

const ProductCard = ({ product, onAddToCart, visibleCount, onProductClick }) => {
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

export default function RingsPage() {
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

  const { products, loading, error } = useRings();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Load saved scroll position and product on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('rings-scroll-position');
    const savedProductId = sessionStorage.getItem('rings-last-product');
    const savedVisibleCount = sessionStorage.getItem('rings-visible-count');
    const savedProducts = sessionStorage.getItem('rings-loaded-products');

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
      sessionStorage.removeItem('rings-loaded-products');
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
              sessionStorage.removeItem('rings-last-product');
              sessionStorage.removeItem('rings-scroll-position');
              sessionStorage.removeItem('rings-visible-count');
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
              sessionStorage.removeItem('rings-last-product');
              sessionStorage.removeItem('rings-scroll-position');
              sessionStorage.removeItem('rings-visible-count');
              setLastProductId(null);
              setScrollPosition(0);
            }, 500);
          }
        } else {
          // Fallback to scroll position if product not found
          setTimeout(() => {
            if (scrollPosition > 0) {
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
              sessionStorage.removeItem('rings-scroll-position');
              setScrollPosition(0);
            }
            sessionStorage.removeItem('rings-last-product');
            setLastProductId(null);
          }, 500);
        }
      } else if (scrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          sessionStorage.removeItem('rings-scroll-position');
          setScrollPosition(0);
        }, 500);
      }
    }
  }, [products, sortedProducts, visibleCount, scrollPosition, lastProductId]);

  useEffect(() => {
    // Only reset if this is a new session (no saved state)
    const hasSavedState = sessionStorage.getItem('rings-scroll-position') || 
                         sessionStorage.getItem('rings-last-product') || 
                         sessionStorage.getItem('rings-visible-count') ||
                         sessionStorage.getItem('rings-loaded-products');
    
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
    sessionStorage.setItem('rings-scroll-position', window.scrollY.toString());
    sessionStorage.setItem('rings-last-product', product._id || product.id);
    sessionStorage.setItem('rings-visible-count', visibleCount.toString());
    
    // Save the actual loaded products data to prevent reloading
    const loadedProducts = sortedProducts.slice(0, visibleCount);
    sessionStorage.setItem('rings-loaded-products', JSON.stringify(loadedProducts));
    
    // Navigate to product page
    window.location.href = `/rings/${product.slug || product._id || product.id}`;
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
        <title>Silver Rings for Women  Silver Ring Designs Online | Mysabri</title>
        <meta
          name="description"
          content="Explore Silver Rings for Women at Mysabri. Shop 925 Pure Silver Rings For Engagement, wedding, and all occasions. Silver ring design for women. Great rings designed only 999!"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-64 sm:pb-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/ring.png"
            alt="Rings Banner"
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
               RINGS
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
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              silver ring for women at Mysabri
            </h1> */}
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

      {/* Testimonials&FQ Zig-zag Content */}
      <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-50/30 py-12 sm:py-20 lg:py-28 font-sans text-neutral-800">
        <div className="w-full px-4 sm:px-6 lg:px-16">
          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide text-neutral-900 mb-4">
              Silver Rings for Women
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Intro Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-100">
            <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
              At Mysabri, we offer the perfect silver rings for women, crafted to blend timeless beauty, exceptional craftsmanship, and modern elegance. Our unique selection features excellent 925 sterling silver rings for women, as well as beautifully designed pure silver rings, all of which are crafted with meticulous attention to detail. Whether you're searching for beautiful engagement silver rings for women that represent eternal love or a simple silver band for everyday use, we have something for every taste.  From sleek, basic bands to elaborately detailed statement designs, our sterling silver rings for women are designed to complement every mood, dress, or event.              
            </p>
          </div>

          {/* Zig-zag Content Sections */}
          <div className="space-y-16 sm:space-y-24">
            
            {/* Section 1 - Content Left, Image Right */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  925 Silver Rings for Women – Authentic Craftsmanship You Can Trust
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Every creation at Mysabri begins with genuine 925 silver rings for women, which are meticulously created by talented Indian craftsmen. Our jewelry combines traditional workmanship with modern elegance, resulting in timeless pieces that you may wear every day or keep for years.
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
                        Each ring undergoes purity testing to confirm that it includes real 92.5% sterling silver, preserving its inherent brightness, durability, and long-lasting beauty. Mysabri provides a chosen collection of silver rings for women, ranging from plain to eye-catching standout designs, beginning at ₹999.
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
                    src="/seo/r1.png" 
                    alt="925 sterling silver rings for women"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Image Left, Content Right */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Pure 925 Sterling Silver Rings – Crafted with Authentic Indian Artistry
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Explore stylish silver rings designed to elevate your everyday and festive looks. Mysabri blends traditional artistry with modern aesthetics to bring you sleek bands, floral motifs, and contemporary silhouettes.
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
                        These versatile 925 silver rings for women make gifting meaningful and accessorizing effortless. Classic silver ring designs for women that combine elegance with casual flair. Every ring at Mysabri is expertly created from real 925 sterling silver and is intended to accentuate your unique style.
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
                    src="/seo/r2.png" 
                    alt="Indian artistry silver rings"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 - Content Left, Image Right */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Engagement Silver Rings for Women – A Promise in Pure Silver
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Celebrate your forever moment with Mysabri's engagement silver rings for women, designed to symbolise love that endures. Handcrafted from 925 sterling silver, each ring captures the essence of commitment — pure, radiant, and eternal.
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
                        Our collection features minimal solitaire styles, vintage-inspired designs, and gemstone-studded bands that bring modern romance to life. Unlike mass-produced jewellery, every Mysabri engagement ring is shaped with emotion and care.
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
                    src="/seo/r4.png" 
                    alt="Engagement silver rings for women"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 - Image Left, Content Right */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Latest Silver Rings for Women Designs for Everyday Elegance
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    The most gorgeous and trendy silver rings for women, adding simple beauty to your everyday look. Today's designs combine simplicity, modern charm, and timeless appeal, making them appropriate for business, casual outings, and special occasions.
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
                        From sleek minimalist bands to elaborate silver ring designs for women, each item gives a polished touch to your personality without being too heavy or overpowering. You'll also find fashionable alternatives such as textured rings, stone-studded designs, adjustable bands, and oxidized motifs.
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
                    src="/seo/r5.png" 
                    alt="Latest silver ring designs"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 5 - Content Left, Image Right */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Stylish Silver Rings Design for Women to Match Every Outfit
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Choosing the appropriate silver ring design for women may transform any look, whether it's casual, ethnic, or modern stylish. Today's trendy silver rings come in a range of patterns, including simple bands, floral motifs, textured designs, geometric forms, and stone-studded elegance.
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
                        These adaptable patterns allow you to easily convey your particular style, regardless of the circumstance. From everyday business wear to celebratory occasions, a well-crafted silver ring design for women provides charm and refinement without overwhelming your ensemble.
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
                    src="/seo/r6.png" 
                    alt="Stylish silver ring designs"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 6 - Image Left, Content Right */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Trendy Silver Toe Rings for Women for Traditional and Modern Looks
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Explore one of the best collections on Mysabri of silver toe rings for women and everyday wear jewellery — all crafted from 925 sterling silver at transparent prices.
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
                        We believe luxury should be accessible, so every silver toe rings for women is priced fairly without compromising quality or craftsmanship. Perfect for both traditional and modern looks.
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
                    src="/seo/r8.png" 
                    alt="Silver toe rings for women"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Section 7 - Content Left, Image Right */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <div className="lg:w-1/2 space-y-4">
                <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                  Best Silver Thumb Rings for Women to Elevate Your Style
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Add a dramatic and modern touch to your jewelry collection with the latest silver thumb rings for women. Thumb rings, which are designed to stand out, make a strong style statement and quickly improve your entire appearance.
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
                        Whether you favor simple bands, boho-inspired patterns, oxidized finishes, or big statement pieces, there's a thumb ring to suit you. Today's popular silver thumb rings for women are made of high-quality 92.5 sterling silver, assuring durability, long-lasting luster, and skin-friendly comfort.
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
                    src="/seo/r12.png" 
                    alt="Silver thumb rings for women"
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
                  Why Silver Rings for Women Are the Perfect Choice for Daily Wear
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Silver rings for women are excellent alternatives for everyday use because they strike the ideal blend of elegance, durability, and comfort. These rings, made of 92.5 sterling silver, are skin-friendly, lightweight, and great for extended use.
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
                        Unlike heavy or showy jewelry, silver rings for women have a gentle sheen that enhances any ensemble without being overpowering. Another significant advantage is its long-lasting durability. Real sterling silver does not fade readily and, with proper care, may retain its brilliant brilliance for years.
                      </p>
                      <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                        To complete your look, explore our elegant collection of <Link
                        href="https://www.mysabri.in/earrings"
                        className="text-amber-700 hover:text-amber-800 underline font-medium"
                      > silver earrings</Link> designed to pair perfectly with any silver ring.
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
                    src="/seo/r14.png" 
                    alt="Silver rings for daily wear"
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
                FAQs – Silver Rings for Women
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
