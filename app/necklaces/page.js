"use client";
/* eslint react/no-unescaped-entities: "off" */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useNecklaces } from "../../hooks/useProducts";
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
    question: "Is a silver necklace for women good for daily wear?",
    answer:
      "Yes, a silver necklace for women is perfect for daily wear because silver is lightweight, durable, and skin-friendly. Simple chains, pendants, and minimal silver necklace set designs are ideal for everyday use.",
  },
  {
    question: "How do I know if my silver necklace is real 925 purity?",
    answer:
      "Look for the 925 hallmark stamped on the clasp or pendant. Real pure silver necklace set pieces will have the mark '925', which stands for 92.5% pure silver. You may also use a magnet to check; a real sterling silver necklace is not magnetic.",
  },
  {
    question:
      "What is the starting price of a silver necklace for women at Mysabri?",
    answer:
      "At Mysabri, our silver necklace for women collection starts at ₹1399, making premium-quality silver jewellery affordable to everyone.",
  },
  {
    question: "Which type of silver necklace is best for gifting?",
    answer:
      "Minimal chains, exquisite pendants, long necklaces, and a fine silver necklace set for women are excellent present ideas. They are suitable for all ages and occasions.",
  },
  {
    question: "How should I clean and maintain my silver necklace?",
    answer:
      "Clean your silver necklace for women with a gentle cloth after each use. To prevent tarnishing, store it in an airtight pouch. To keep your jewellery silver necklace gleaming like new, occasionally clean it with mild silver polish or a gentle soap-water solution.",
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

export default function NecklacesPage() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 50000,
    minRating: 0,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
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
  const [visibleCount, setVisibleCount] = useState(Number.MAX_SAFE_INTEGER);

  const { products, loading, error } = useNecklaces();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Load saved scroll position and product on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('necklaces-scroll-position');
    const savedProductId = sessionStorage.getItem('necklaces-last-product');

    if (savedPosition) {
      setScrollPosition(parseInt(savedPosition));
    }
    if (savedProductId) {
      setLastProductId(savedProductId);
    }
  }, []);

  // Restore scroll position after products are loaded
  useEffect(() => {
    if (products.length > 0 && (scrollPosition > 0 || lastProductId)) {
      // If we have a specific product to scroll to
      if (lastProductId) {
        setTimeout(() => {
          const productElement = document.querySelector(`[data-product-id="${lastProductId}"]`);
          if (productElement) {
            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (scrollPosition > 0) {
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          }
          
          // Clear saved state
          sessionStorage.removeItem('necklaces-last-product');
          sessionStorage.removeItem('necklaces-scroll-position');
          setLastProductId(null);
          setScrollPosition(0);
        }, 500);
      } else if (scrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          sessionStorage.removeItem('necklaces-scroll-position');
          setScrollPosition(0);
        }, 500);
      }
    }
  }, [products, scrollPosition, lastProductId]);

  useEffect(() => {
    setVisibleCount(Number.MAX_SAFE_INTEGER);
  }, [sortBy, filters, products]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
  };

  const handleProductClick = (product) => {
    // Save current scroll position and product info before navigating
    sessionStorage.setItem('necklaces-scroll-position', window.scrollY.toString());
    sessionStorage.setItem('necklaces-last-product', product._id || product.id);
    
    // Navigate to product page
    window.location.href = `/necklaces/${product.slug || product._id || product.id}`;
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
        <title>Silver Necklace for Women | Latest Silver Necklace Sets Online</title>
        <meta
          name="description"
          content="Best Stylish silver necklace for women & men, pure silver necklace sets, long necklaces. Premium quality & fast delivery. Certified jewellery only 1399/- Shop now!"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-64 sm:pb-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/neck.jpeg"
            alt="Necklaces Banner"
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
               NECKLACES
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
              Necklaces
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
              Silver Necklace for Women
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Intro Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-100">
            <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
              At Mysabri, we offer exquisite silver necklace for women, crafted to blend timeless elegance, exceptional craftsmanship, and modern sophistication. Our curated collection features stunning 925 sterling silver necklaces, as well as beautifully designed pure silver necklace sets, all created with meticulous attention to detail. Whether you're seeking graceful chains for daily wear or bold statement pieces for special occasions, we have something for every style. From classic designs to contemporary patterns, our sterling silver necklaces are designed to complement every personality, outfit, and moment.
            </p>
          </div>

          {/* Zig-zag Content Sections */}
          <div className="space-y-16 sm:space-y-24">
              {/* Section 1 - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
                <div className="lg:w-1/2 space-y-4">
                  <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                    Elegant 925 Sterling Silver Necklaces – Timeless Beauty for Modern Women
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Discover the perfect blend of elegance and craftsmanship with Mysabri's exquisite silver necklace for women. Each piece is meticulously crafted from genuine 925 sterling silver, ensuring lasting shine, durability, and comfort for everyday wear.
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
                          Our collection features everything from delicate chains to bold statement pieces, each designed to complement your unique style. Whether you're dressing up for a special occasion or adding sophistication to your daily look, these silver necklaces offer the perfect balance of femininity and elegance.
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
                      src="/seo/n1.jpg" 
                      alt="925 sterling silver necklaces for women"
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
                    Silver Necklace Sets – Complete Elegance for Every Occasion
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Elevate your style with our coordinated silver necklace sets. These perfectly matched combinations feature exquisite designs that create a harmonious and sophisticated look, ideal for weddings, festivals, and special celebrations.
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
                          Our necklace sets include matching earrings and sometimes bracelets, providing a complete coordinated look. Each set is designed to make dressing effortless while ensuring you look perfectly put together for any occasion.
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
                      src="/seo/n2.jpg" 
                      alt="Silver necklace sets for women"
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
                    Long Silver Necklaces – Dramatic Elegance for Special Moments
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Make a stunning statement with our long silver necklaces. These dramatic pieces feature extended lengths and intricate designs that create eye-catching silhouettes, perfect for evening events and formal occasions.
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
                          Our long necklace collection includes layered designs, pendant chains, and statement pieces that draw attention to your neckline. Each piece is carefully balanced to provide impressive presence without compromising on comfort or wearability.
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
                      src="/seo/n3.jpg" 
                      alt="Long silver necklaces for women"
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
                    Pendant Silver Necklaces – Personalized Charm and Style
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Express your individuality with our beautiful pendant silver necklaces. These versatile pieces feature distinctive pendants that add personal meaning and visual interest to your everyday and special occasion looks.
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
                          Our pendant collection includes geometric shapes, nature-inspired designs, and traditional motifs that allow you to showcase your personality. Each pendant is carefully crafted to ensure it remains secure while adding beautiful movement to your necklace.
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
                      src="/seo/n4.jpg" 
                      alt="Pendant silver necklaces for women"
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
                    Choker Silver Necklaces – Modern Chic for Contemporary Style
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Embrace modern elegance with our chic choker silver necklaces. These close-fitting designs sit beautifully at the neckline, creating a sophisticated look that's perfect for both casual and formal settings.
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
                          Our choker collection includes simple bands, decorated designs, and adjustable styles that ensure perfect comfort. These versatile pieces can be worn alone or layered with longer necklaces for a trendy, stacked look.
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
                      src="/seo/n5.jpg" 
                      alt="Choker silver necklaces for women"
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
                    Layered Silver Necklaces – Trendy Styling for Fashion-Forward Look
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Create a fashion-forward statement with our layered silver necklaces. These multi-strand designs offer instant sophistication and visual interest, perfect for those who love contemporary, stacked styling.
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
                          Our layered collection includes pre-stacked designs and mix-and-match pieces that allow you to create your own unique combinations. These necklaces add depth and dimension to your outfit, making them perfect for both casual and formal occasions.
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
                      src="/seo/n6.jpg" 
                      alt="Layered silver necklaces for women"
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
                    Traditional Silver Necklaces – Timeless Heritage Designs
                  </h2>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                      Celebrate cultural heritage with our traditional silver necklaces. These authentic designs feature classic patterns and motifs that honor traditional craftsmanship while remaining relevant for modern wear.
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
                          Our traditional collection includes temple jewelry, ethnic patterns, and cultural motifs that have been passed down through generations. Each piece tells a story of heritage while offering timeless elegance for weddings and cultural celebrations.
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
                      src="/seo/n7.jpg" 
                      alt="Traditional silver necklaces for women"
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
                  Minimalist Silver Necklaces – Understated Elegance for Daily Wear
                </h2>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                    Discover the beauty of simplicity with our minimalist silver necklaces. These clean, refined designs offer subtle elegance that perfects your everyday look without overwhelming your style.
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
                        Our minimalist collection features simple chains, delicate pendants, and clean geometric shapes that embody modern sophistication. These versatile pieces transition seamlessly from office wear to evening outings, making them essential staples for any jewelry collection.
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
                    src="/seo/n8.png" 
                    alt="Minimalist silver necklaces for women"
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
                FAQs – Silver Necklace for Women
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
