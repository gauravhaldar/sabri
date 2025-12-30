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
      <div className="relative text-white pt-28 sm:pt-40 pb-64 sm:pb-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner/earring.jpeg"
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
        <div className="mt-10 space-y-6 text-gray-800 text-sm sm:text-base leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Our Best Silver Earrings for Women
          </h1>
          <p>
            The finest silver earrings for women from Mysabri combine style and
            craftsmanship to give any ensemble a timeless charm. Every item in our
            collection is created by hand from 925 sterling silver. Our best silver
            earrings for women guarantee years of purity, luster, and durability.
            Mysabri offers the ideal set of silver earrings for every event, whether
            you like striking long drop earrings, stylish silver hoop earrings, or
            simple silver stud earrings.
          </p>
          <p>
            At MySabri, we think that silver jewelry should represent your uniqueness
            in addition to enhancing your appearance. Each piece is therefore
            carefully crafted to strike a balance between comfort and refinement.
            Discover luxury that suits your taste and price range by looking through
            our extensive selection of pure silver earrings for women & girls.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Elegant 925 Sterling Silver Earrings for Women
          </h2>
          <p>
            Our 925 sterling silver earrings for women offer unparalleled quality and
            luster. These precisely crafted silver earrings add elegance, durability,
            and a long-lasting gloss to any ensemble. The sterling silver line from
            Mysabri adds classic elegance and sophistication to your daily look. Get
            the purest silver jewelry, including earrings, right now.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Long and Drop Silver Earrings to Elevate Your Look
          </h2>
          <p>
            Perfect for nighttime wear or events, these long silver earrings and
            silver drop earrings will add to your elegance. These patterns, which are
            lightweight and adaptable, elegantly draw attention to your neckline and
            make a statement wherever you go.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Silver Earrings for Women to Redefine Your Style
          </h2>
          <p>
            With silver earrings for women from Mysabri, you may exude classic
            elegance. Each pair is made from high-quality 925 sterling silver, which
            adds beauty and durability. Whether you prefer elegant drops, dramatic
            hoops, or classic studs, our selection of silver earrings is made to fit
            any occasion or mood. These earrings enhance your appearance with
            refinement and shine, making them ideal for both festive occasions and
            everyday wear. Discover designs that skillfully combine traditional
            workmanship and modern design, making Mysabri your one-stop shop for
            exquisite silver earrings and jewelry.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Long Silver Earrings for Women – Graceful Designs for Every Occasion
          </h2>
          <p>
            Long silver earrings for women from Mysabri will give your look a dash of
            glitz and refinement. These elegant earrings go well with any ensemble and
            are ideal for weddings, parties, and festive occasions. Our long silver
            earrings are crafted with precision, combining lightweight comfort with
            intricate detailing to create a look that’s both modern and timeless.
            Regardless of your preference for bold danglers or simple silver
            earrings, each style exquisitely frames your face, enhancing your look
            with elegance and shine.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Sterling Silver Earrings for Girls – Chic and Everyday Ready
          </h2>
          <p>
            Mysabri offers a delightful range of sterling silver earrings for girls
            that are the ideal combination of simplicity and elegance. Each pair of
            silver earrings, from delicate studs to small hoops, is made of pure 925
            sterling silver, making them safe, hypoallergenic, and easy to wear every
            day. These silver earrings are perfect for school, work, or casual
            outings, offering uncomplicated appeal for every occasion. Give her a pair
            now and watch her radiate with confidence and elegance.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Premium Sterling Silver Earrings to Suit Every Style
          </h2>
          <p>
            Our exquisite selection of sterling silver earrings at Mysabri is made to
            fit all tastes and personalities. From delicate studs to striking
            statement pieces, our silver earrings collection has something for
            everyone, whether you prefer sleek, contemporary jewelry or classic
            elegance. For optimal purity, luster, and longevity, genuine 925 sterling
            silver is used to craft each pair of ladies' and girls' silver earrings.
            Our hypoallergenic, skin-safe earrings are ideal for both special events
            and everyday usage. Mysabri's silver earrings are the ideal option for
            self-expression, dressing, and gifting, thanks to their classic styles and
            finely crafted details. Savor long-lasting elegance with ease and
            affordability.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Stylish Silver Hoop Earrings for Every Occasion
          </h2>
          <p>
            Add flair to your look with our silver hoop earrings, available in small,
            large, and textured designs. Whether it’s a casual outing or festive
            celebration, these hoops bring effortless charm and modern appeal to your
            ensemble.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Long and Drop Silver Earrings to Elevate Your Look
          </h2>
          <p>
            Enhance your elegance with our long silver earrings and silver drop
            earrings, perfect for parties or evening wear. Lightweight and versatile,
            these designs highlight your neckline beautifully and make a graceful
            statement wherever you go.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Unique Silver Earrings Design for Women and Girls
          </h2>
          <p>
            Mysabri combines traditional artistry with modern fashion to create a vast
            array of earrings designed for women and girls. Every design, from tiny
            drops to striking hoops, exudes originality, style, and fine craftsmanship
            for the contemporary woman.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Fashionable Silver Stud Earrings for Everyday Use
          </h2>
          <p>
            For ladies who enjoy understated yet sophisticated accessories, our silver
            stud earrings are ideal. Each pair has a comfortable fit and a polished
            finish, making them perfect for everyday use. Examine simple looks that
            incorporate a hint of glitz without overwhelming your appearance.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            925 Silver Rings for Women – Authentic Craftsmanship You Can Trust
          </h2>
          <p>
            Complete your look by pairing these elegant 925 silver rings with our beautifully crafted silver earrings for women. Mysabri offers a wide range of stylish silver earrings — from minimalist studs to premium designer pieces — all made from pure 925 sterling silver. These 925 silver earrings complement our <Link
              href="https://www.mysabri.in/rings"
              className="hover:underline"
            > ring collection </Link>
            perfectly, helping you create a coordinated and elegant jewellery set for both daily wear and special occasions.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-black">
            FAQs For Silver Earrings
          </h3>
          <div className="space-y-3 mt-2">
            {FAQS.map((faq, index) => (
              <div
                key={faq.question}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-semibold text-sm sm:text-base text-gray-900">
                    {faq.question}
                  </span>
                  <span className="ml-2 text-lg leading-none text-gray-600">
                    {openFaqIndex === index ? "-" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
