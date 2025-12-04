"use client";

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

const ProductCard = ({ product, onAddToCart }) => {
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
    <div className="bg-white group">
      <Link href={`/bracelets/${product.slug || product.id}`} className="block">
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
      </Link>
      <div className="p-3">
        <Link href={`/bracelets/${product.slug || product.id}`}>
          <h3 className="text-xs font-light text-black mb-1.5 line-clamp-2 leading-tight hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
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

  const { products, loading, error } = useBracelets();

  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
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
          Pure Silver Bracelet for Men’s | 925 Silver Bracelets Online
        </title>
        <meta
          name="description"
          content="Shop pure silver bracelet for mens online at Mysabri. Explore 925 silver bracelet for men designs with affordable prices, premium quality, and long-lasting durability. Buy now!"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-48 sm:pb-60 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/braceletb.png"
            alt="Bracelets Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block">
              <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm px-4 py-2 rounded-full font-medium tracking-wide">
                 BRACELETS
              </span>
            </div>
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
            Pure Silver Bracelet for Men
          </h1>
          <p>
            Upgrade your accessory collection with a handcrafted pure silver bracelet
            for men from Mysabri. Our premium bracelets blend modern design with
            authentic 92.5 sterling silver, giving you a stylish, durable accessory
            perfect for everyday wear. Explore our wide selection of pure silver
            bracelet for men and discover the piece that reflects your personality and
            elevates your look.
          </p>
          <p>
            Every pure silver bracelet for men in our collection is made from 100%
            genuine 92.5 sterling silver, ensuring long-lasting shine, skin-friendly
            comfort, and unmatched durability. Perfect for daily wear, gifting, or
            special occasions, these bracelets add a touch of sophistication and
            confidence to any outfit.
          </p>
          <p>
            Our curated range features a blend of modern elegance and traditional
            craftsmanship, making every pure silver bracelet for men a meaningful and
            fashionable choice. Whether you're enhancing your personal style or
            searching for a premium gift, Mysabri brings you the finest designs and
            top-quality silver accessories.
          </p>
          <p>
            Browse our stylish and affordable options today to find the ideal pure
            silver bracelet for men that perfectly complements your unique style. Shop
            now and elevate your fashion with authentic sterling silver
            craftsmanship!
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Why Choose a 925 Pure Silver Bracelet for Men
          </h2>
          <p>
            Choosing a 925 pure silver bracelet for men gives you the perfect blend
            of style, strength, and long-lasting value. Made with 92.5% genuine
            sterling silver, these bracelets are highly durable, skin-friendly, and
            naturally tarnish-resistant — making them ideal for everyday use. Unlike
            plated or imitation jewellery, a 925 pure silver bracelet for men
            maintains its shine, purity, and elegance for years.
          </p>
          <p>
            A 925 pure silver bracelet for men also offers the perfect balance of
            elegance and masculinity. Whether you prefer a sleek chain, a bold
            designer style, or a heavy masculine bracelet, pure silver adds a refined
            touch to any outfit. It also serves as a thoughtful and premium gift for
            birthdays, anniversaries, festivals, and special occasions.
          </p>
          <p>
            At Mysabri, each 925 pure silver bracelet for men is crafted with
            precision and care to deliver unmatched polish and durability. If you
            value authenticity, quality, and timeless fashion, choosing a 925 pure
            silver bracelet for men is the perfect way to elevate your everyday
            style.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Latest Pure Silver Bracelet Designs for Men
          </h2>
          <p>
            The latest pure silver bracelet designs for men combine current flair and
            classic grace. At Mysabri, we provide a diverse selection of handcrafted
            92.5 sterling silver bracelets to fit every personality. From elegant
            basic chains to dramatic statement cuffs, our collection combines high
            workmanship with current fashion.
          </p>
          <p>
            Each bracelet is crafted of high-quality pure silver, assuring a
            long-lasting lustre, durability, and comfort for everyday use. Whether you
            choose a basic and refined appearance or a more intricate and masculine
            design, these pure silver bracelets will easily improve your style.
            Explore our updated styles to find the ideal item that exudes confidence,
            uniqueness, and modern refinement.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Premium Pure Silver Bracelet for Men for Every Occasion
          </h2>
          <p>
            Pure silver bracelet for men designs are loved because they offer the
            perfect balance of elegance and masculinity. Whether you prefer a simple
            silver bracelet, a bold designer piece, or a heavy masculine style, a pure
            silver bracelet for men adds timeless class to every outfit. It also makes
            a thoughtful and premium gift choice for birthdays, anniversaries, and
            other special occasions.
          </p>
          <p>
            At Mysabri, each pure silver bracelet for men is crafted with precision to
            deliver unmatched shine, durability, and long-lasting quality. If you
            value authenticity, style, and comfort, our 925 pure silver bracelet for
            men collection is the ideal way to upgrade your everyday look with
            confidence and sophistication.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Shop Premium Pure Silver Bracelets for Men Online at Mysabri
          </h2>
          <p>
            Shop the finest pure silver bracelets for men online at Mysabri and
            discover a range that combines current style and long-lasting quality. Our
            collection includes genuine 925 silver bracelet mens designs made from
            92.5 sterling silver for unparalleled durability, brilliance, and
            comfort.
          </p>
          <p>
            Whether you choose a pure silver bracelet for men, minimalist chain
            styles, bold heavy motifs, or modern patterns, Mysabri has something for
            every personality. Each bracelet is skin-friendly, tarnish-resistant, and
            suitable for both daily and special events.
          </p>
          <p>
            We provide timeless items that exude elegance and confidence, with
            guaranteed purity, reasonable prices, and handcrafted pure silver
            bracelets for men. Shop the best pure silver bracelets for men today and
            elevate your look with Mysabri.
          </p>

          <p>If you're looking to complete your silver accessory collection, explore our beautifully crafted <Link
              href="https://www.mysabri.in/rings"
              className="hover:underline"
            > 925 Silver Rings for Women </Link> Every ring is made with genuine 92.5 sterling silver, offering the same premium shine and durability as our bracelets. Pairing a pure silver bracelet with an elegant silver ring creates a balanced, stylish look perfect for daily wear or special occasions.</p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Trending 925 Silver Bracelet Mens Styles in 2025
          </h2>
          <p>
            The most popular 925 silver bracelet for men styles in 2025 blend new
            trends with traditional elegance. Minimal chain bracelets for men remain a
            popular choice for everyday use, providing a clean and polished
            appearance. Heavy pure silver bracelets and oxidised motifs are popular
            among individuals who seek a more masculine aesthetic.
          </p>
          <p>
            Beaded silver bracelets, etched patterns, and mixed-style pieces are also
            becoming popular among men seeking distinctive and personalised
            accessories. Whether you choose a simple, elegant design or a unique
            bracelet that represents your individuality, the newest trends in 925
            sterling silver bracelets have something for everyone. Upgrade your
            collection with the most elegant and durable pure silver pieces in 2025.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Benefits of Wearing Pure Silver Bracelets for Men Daily
          </h2>
          <p>
            Wearing pure silver bracelets for men daily delivers more than simply
            style; it also provides comfort, durability, and long-term value. Pure
            925 sterling silver is skin-friendly, making it appropriate for daily
            usage without causing discomfort. Its natural shine complements both
            casual and formal attire, offering men a clean, confident appearance
            throughout the day.
          </p>
          <p>
            Pure silver is also recognised for its strength, making a pure silver
            bracelet for men suitable for daily usage without losing form or lustre.
            Many men pick silver because it is lightweight, attractive, and simple to
            coordinate with watches and other accessories. Furthermore, wearing
            genuine silver represents refinement and personal flair, making it a
            timeless addition to any jewellery collection.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            How to Identify Real 925 Sterling Silver Bracelets for Men
          </h2>
          <p>
            Identifying a genuine 925 sterling silver bracelet for men is simple if
            you know what to look for. The first indication of legitimacy is the
            "925" hallmark imprinted on the bracelet, which indicates that it contains
            92.5% pure silver. Genuine sterling silver also has a natural sheen and a
            slightly heavier feel than imitation or plated jewellery.
          </p>
          <p>
            Genuine 925 silver bracelets for men will not have a strong metallic or
            chemical odour, and they will not peel or fade with time. You may also use
            a soft cloth test to determine authenticity; pure silver produces a faint
            black residue owing to natural oxidation. Purchasing from reputable
            retailers like Mysabri guarantees that each bracelet is made of certified,
            high-quality 925 sterling silver.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Best Pure Silver Bracelet for Men Gift Ideas for Every Budget
          </h2>
          <p>
            Looking for the best present for him? Pure silver bracelets for men are
            an exquisite and thoughtful gift, and Mysabri has selections at various
            price points. If you're on a limited budget, choose a classic 925 silver
            bracelet, which is inexpensive, timeless, and adaptable enough for
            everyday wear.
          </p>
          <p>
            A beaded sterling silver bracelet for men with delicate features or a
            softly oxidised finish is a stylish mid-range present that won't break the
            bank. It's elegant, long-lasting, and has a high-quality feel.
          </p>
          <p>
            If you're willing to spend more, choose a strong statement cuff or luxury
            silver bracelet for men with elaborate designs or personalised
            inscriptions. These pieces not only appear magnificent, but they also have
            sentimental meaning, making them great for birthdays, anniversaries, and
            milestone occasions.
          </p>
          <p>
            Regardless of your budget, a pure silver bracelet for men from Mysabri is
            a meaningful and long-lasting present that combines beauty and
            authenticity.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            How to Style Pure Silver Bracelets for Men with Any Outfit
          </h2>
          <p>
            Styling pure silver bracelets for men is simple because they go with every
            outfit. A basic 925 silver chain bracelet with jeans and a T-shirt creates
            a clean, modern look. If you're preparing for the workplace, a sleek and
            basic silver bracelet provides refinement without overwhelming your formal
            outfit.
          </p>
          <p>
            For parties or festive events, pair pure silver bracelets for men with
            timepieces or stack them for a bold, stylish look. Silver bracelets
            provide beauty and adaptability to every outfit, regardless of style.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-black">
            FAQs – Pure Silver Bracelet for Men
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
