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

  const productImage = getProductImageUrl(product);
  const hoverImage = getProductHoverImageUrl(product);
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);
  const rating = Number(product.averageRating || product.rating?.average || 0);

  return (
    <div className="bg-white group">
      <Link href={`/rings/${product.slug || product.id}`} className="block">
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
      </Link>
      <div className="p-3">
        <Link href={`/rings/${product.slug || product.id}`}>
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

  const { products, loading, error } = useRings();

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
        <title>Silver Rings for Women  Silver Ring Designs Online | Mysabri</title>
        <meta
          name="description"
          content="Explore Silver Rings for Women at Mysabri. Shop 925 Pure Silver Rings For Engagement, wedding, and all occasions. Silver ring design for women. Great rings designed only 999!"
        />
      </Head>
      {/* Hero Banner */}
      <div className="relative text-white pt-28 sm:pt-40 pb-48 sm:pb-60 overflow-hidden">
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
              SILVER RING FOR WOMEN AT MYSABRI
            </h1>
          <p>
            At Mysabri, we offer the perfect silver rings for women, crafted to blend
            timeless beauty, exceptional craftsmanship, and modern elegance. Our
            unique selection features excellent 925 sterling silver rings for women,
            as well as beautifully designed pure silver rings, all of which are
            crafted with meticulous attention to detail. Whether you're searching for
            beautiful engagement silver rings for women that represent eternal love or
            a simple silver band for everyday use, we have something for every taste.
          </p>
          <p>
            Every ring in our collection is made of real 925 sterling silver, which
            guarantees long-lasting durability and a beautiful lustre that never
            fades. From sleek, basic bands to elaborately detailed statement designs,
            our sterling silver rings for women are designed to complement every mood,
            dress, or event.
          </p>
          <p>
            Our minimalist and simple silver ring designs are ideal for everyday use,
            while our superior handcrafted pieces are thoughtful gifts for loved ones.
            Discover elegance, comfort, and style with our carefully picked collection
            of 925 silver rings and pure silver rings for women, designed to
            highlight your inherent beauty and upgrade your everyday appearance.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            925 Silver Ring for Women – Authentic Craftsmanship You Can Trust
          </h2>
          <p>
            Every creation at Mysabri begins with genuine 925 silver rings for women,
            which are meticulously created by talented Indian craftsmen. Our jewelry
            combines traditional workmanship with modern elegance, resulting in
            timeless pieces that you may wear every day or keep for years. Each ring
            undergoes purity testing to confirm that it includes real 92.5% sterling
            silver, preserving its inherent brightness, durability, and long-lasting
            beauty.
          </p>
          <p>
            Mysabri provides a chosen collection of silver rings for women, ranging
            from plain to eye-catching standout designs, beginning at ₹999. Our silver
            rings for women are meant to provide excellent quality without the high
            price tag, resulting in great value and craftsmanship.
          </p>
          <p>
            Every ring is nickel-free, skin-friendly, and meticulously handmade for
            maximum comfort and longevity. From simple everyday wear to sophisticated
            designs for special occasions, Mysabri is your go-to source for real
            silver rings for women in India, where purity, elegance, and
            affordability blend effortlessly.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Pure 925 Sterling Silver Rings – Crafted with Authentic Indian Artistry
          </h2>
          <p>
            Explore stylish silver rings designed to elevate your everyday and
            festive looks. Mysabri blends traditional artistry with modern aesthetics
            to bring you sleek bands, floral motifs, and contemporary silhouettes.
            These versatile 925 silver rings for women make gifting meaningful and
            accessorizing effortless.
          </p>
          <p>
            Classic silver ring designs for women that combine elegance with casual
            flair. Every ring at Mysabri is expertly created from real 925 sterling
            silver and is intended to accentuate your unique style. Our silver rings
            for women design, which ranges from sleek contemporary bands to elaborate
            floral designs, offers a harmony of style and power that makes them ideal
            for giving or showing off.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Sterling Silver Rings for Women – Redefining Modern Elegance
          </h2>
          <p>
            Mysabri honours the essence of sterling silver rings for women, elegant,
            robust, and eternally flexible. We are made of hallmarked 925 silver
            rings, expressing purity and purpose. Every design is influenced by the
            rhythm of modern life, from the gleam of a silver engagement ring for
            women to the simplicity of an everyday band.
          </p>
          <p>
            Our artists mix traditional silversmithing techniques with modern style to
            create rings that feel both sumptuous and effortless. Mysabri's silver
            ring design for women collection is ideal for individuals who value beauty
            in the details, with clean lines, smooth finishes, and subtle shine that
            boosts your daily confidence. Our sterling silver rings for women provide a
            touch of elegance to every occasion, be it work, love, or celebration.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Engagement Silver Rings for Women – A Promise in Pure Silver
          </h2>
          <p>
            Celebrate your forever moment with Mysabri's engagement silver rings for
            women, designed to symbolise love that endures. Handcrafted from 925
            sterling silver, each ring captures the essence of commitment — pure,
            radiant, and eternal. Our collection features minimal solitaire styles,
            vintage-inspired designs, and gemstone-studded bands that bring modern
            romance to life.
          </p>
          <p>
            Unlike mass-produced jewellery, every Mysabri engagement ring is shaped
            with emotion and care. The lustrous finish of pure silver rings for women
            adds a timeless charm to your story, while our ethical craftsmanship
            ensures quality you can feel. For those who seek beauty, meaning, and
            authenticity, Mysabri's engagement silver rings for women are a reflection
            of love — pure and everlasting.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Latest Silver Rings for Women Designs for Everyday Elegance
          </h2>
          <p>
            The most gorgeous and trendy silver rings for women, adding simple beauty
            to your everyday look. Today's designs combine simplicity, modern charm,
            and timeless appeal, making them appropriate for business, casual
            outings, and special occasions. From sleek minimalist bands to elaborate
            silver ring designs for women, each item gives a polished touch to your
            personality without being too heavy or overpowering.
          </p>
          <p>
            You'll also find fashionable alternatives such as textured rings,
            stone-studded designs, adjustable bands, and oxidized motifs, all designed
            to complement diverse fashion tastes. Dainty stacking rings are popular
            among ladies who want understated elegance, while those who prefer a
            stronger look can experiment with wide-band or engraved varieties.
          </p>
          <p>
            The latest silver rings for women are ideal for everyday use, giving, or
            adding to your trademark accessory collection. They provide durability,
            sparkle, and unrivaled adaptability. Whether you're dressed up or going
            casual, these patterns make every appearance effortlessly stunning.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Stylish Silver Ring Design for Women to Match Every Outfit
          </h2>
          <p>
            Choosing the appropriate silver ring design for women may transform any
            look, whether it's casual, ethnic, or modern stylish. Today's trendy
            silver rings come in a range of patterns, including simple bands, floral
            motifs, textured designs, geometric forms, and stone-studded elegance,
            making them versatile for any outfit. These adaptable patterns allow you
            to easily convey your particular style, regardless of the circumstance.
          </p>
          <p>
            From everyday business wear to celebratory occasions, a well-crafted
            silver ring design for women provides charm and refinement without
            overwhelming your ensemble. Dainty rings are ideal for understated
            elegance, but flamboyant designer designs immediately make a statement.
            You may also mix and match different ring types to achieve a fashionable
            stacking effect that complements your entire appearance.
          </p>
          <p>
            Whether you desire something classic or trendy, the proper silver ring
            design for women will keep you stylish and confident every day.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Trendy Silver Toe Rings for Women for Traditional and Modern Looks
          </h2>
          <p>
            Explore one of the best collections on Mysabri of silver toe rings for
            women and everyday wear jewellery — all crafted from 925 sterling silver at
            transparent prices. We believe luxury should be accessible, so every
            silver toe rings for women is priced fairly without compromising quality or
            craftsmanship.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Best Silver Thumb Rings for Women to Elevate Your Style
          </h2>
          <p>
            Add a dramatic and modern touch to your jewelry collection with the
            latest silver thumb rings for women. Thumb rings, which are designed to
            stand out, make a strong style statement and quickly improve your entire
            appearance. Whether you favor simple bands, boho-inspired patterns,
            oxidized finishes, or big statement pieces, there's a thumb ring to suit
            you.
          </p>
          <p>
            Today's popular silver thumb rings for women are made of high-quality 92.5
            sterling silver, assuring durability, long-lasting luster, and
            skin-friendly comfort. These rings look well with both western and ethnic
            clothes, making them perfect for casual outings, parties, holiday wear,
            and even everyday use.
          </p>
          <p>
            If you enjoy playing with accessories, thumb rings are an excellent method
            to demonstrate confidence and personality. A silver thumb ring for women
            may be worn alone for a clean, sophisticated look or layered with other
            rings for a stacked, stylish design. It will always boost your entire
            appearance with elegance and personality.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Why Silver Rings for Women Are the Perfect Choice for Daily Wear
          </h2>
          <p>
            Silver rings for women are excellent alternatives for everyday use because
            they strike the ideal blend of elegance, durability, and comfort. These
            rings, made of 92.5 sterling silver, are skin-friendly, lightweight, and
            great for extended use, making them appropriate for both casual and
            business situations.
          </p>
          <p>
            Unlike heavy or showy jewelry, silver rings for women have a gentle sheen
            that enhances any ensemble without being overpowering. Whether you like a
            plain band, a fashionable stacking ring, or a complex silver ring design
            for women, these items will complement your everyday style.
          </p>
          <p>
            Another significant benefit is its long-lasting durability. Real sterling
            silver does not fade readily and, with proper care, may retain its
            brilliant brilliance for years. Furthermore, silver is less expensive than
            other precious metals, making it simple to create a diverse collection.
          </p>
          <p>
            From professional meetings to weekend excursions, silver rings for women
            bring classic elegance and confidence to your daily style, making them the
            ideal accent for any occasion.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
              Pure 925 Silver Rings Crafted with Perfection
          </h2>
          <p>
            
            Since all of Mysabri's creations are crafted from pure<Link
              href="https://www.mysabri.in/new-arrivals"
              className="hover:underline"
            > 925 sterling silver</Link>
            , their authenticity and long-lasting luster are guaranteed. Our
            sterling silver rings for women are renowned for their high quality,
            hypoallergenic nature, and softness toward the skin. Our collection honors
            purity, toughness, and contemporary Indian artistry, regardless of your
            preference for understated elegance or striking statement pieces.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-black">FAQs About Silver Rings</h3>
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
