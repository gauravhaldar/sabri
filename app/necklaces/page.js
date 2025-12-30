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
        <div className="mt-10 space-y-6 text-gray-800 text-sm sm:text-base leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Silver Necklace for Women
          </h1>
          <p>
            Upgrade your jewellery collection with our special selection of silver
            necklaces for women, which is created to accentuate your elegance with
            every outfit. At Mysabri, we offer high-quality styles that make it easy
            to choose the perfect silver necklace for women, whether you prefer
            minimalist chains, classic patterns, or fashionable everyday pieces.
          </p>
          <p>
            Each piece in our line is meticulously designed to provide a lifetime of
            shine, comfort, and durability. From a pure silver necklace for women to
            trendy fashion necklaces, each design emphasises the elegance of a silver
            necklace for women while accommodating a variety of tastes and events.
          </p>
          <p>
            Explore our one-of-a-kind masterpieces and discover why Mysabri is the
            ideal choice for a trendy, affordable, and high-quality 925 silver
            necklace for women, handcrafted to perfection.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Latest Silver Necklace for Women Designs to Elevate Your Style
          </h2>
          <p>
            The most popular and attractive silver necklace for women, made to suit
            any fashion style. From sleek, minimalist chains to bold statement pieces,
            our latest collection features exquisitely designed necklaces that add
            beauty and charm to every ensemble. Whether you choose trendy geometric
            shapes, classic themes, or stacked silver necklaces, each design is
            intended to match your own personality.
          </p>
          <p>
            Mysabri focuses on high-quality craftsmanship to ensure that each necklace
            has a long-lasting lustre and durability. Explore our latest arrivals to
            discover the perfect silver necklace for women, perfect for enhancing your
            everyday appearance or completing a special-occasion set.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Why Silver Necklace for Women Is the Perfect Everyday Accessory
          </h2>
          <p>
            A silver necklace for women is one of the most flexible accessories you
            can have, making it ideal for daily wear. Its exquisite sheen complements
            casual clothes, workplace attire, and special events without appearing
            overly heavy or dazzling. 925 sterling silver is lightweight, soft, and
            resilient, letting you wear it all day without discomfort.
          </p>
          <p>
            Because silver complements every skin tone and dress type, it enhances
            your appearance without overwhelming it. Whether you prefer a simple
            chain, a delicate pendant, or a stylish layered design, a silver necklace
            for women elevates your everyday look while remaining timeless and
            affordable.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            How to Choose the Right Silver Necklace for Women for Any Occasion
          </h2>
          <p>
            The ideal silver necklace for women is determined by your personal style
            and the occasion at hand. For everyday wear, simple silver necklaces for
            women or lightweight silver necklace sets are ideal since they provide
            comfort and elegance without feeling heavy. If you prefer a more refined
            style, a pure silver necklace set adds refinement while remaining
            durable.
          </p>
          <p>
            For workplace attire, opt for simple or short-chain styles that complement
            professional clothing well. Special events necessitate bolder styles, such
            as lengthy necklaces, pearl chokers, or designer jewellery silver necklace
            pieces that enhance your whole appearance. By combining your particular
            style with the proper design, you may find a silver necklace for women
            that complements every outfit.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Shop Premium Silver Necklace for Women Online at Mysabri
          </h2>
          <p>
            Shopping for a silver necklace for women is made easy with Mysabri's
            superior online assortment. We have a diverse selection of styles,
            including a silver necklace set for women, a pure silver necklace set,
            attractive long necklaces, pearl chokers, and exquisite pieces suitable
            for everyday use or special events. Each silver necklace for women is
            meticulously manufactured to ensure durability, lustre, and long-term
            quality.
          </p>
          <p>
            Whether you're looking for a simple chain, a fashionable pendant, or a
            high-end jewellery silver necklace, Mysabri offers true workmanship at
            reasonable costs. Our selected assortment makes it simple to choose the
            perfect silver necklace for women that suits your style, personality, and
            budget — all delivered with fast delivery and dependable service. Shop
            with confidence and enhance your appearance with Mysabri's best silver
            jewellery.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Benefits of Wearing a Silver Necklace for Women Daily
          </h2>
          <p>
            Wearing a silver necklace for women every day has both aesthetic and
            practical benefits. Silver is noted for its durability, lightweight feel,
            and timeless sheen, making it ideal for everyday use. Many women like
            basic chains, modest pendants, or a lightweight silver necklace set for
            women since they complement any ensemble without being overly heavy.
          </p>
          <p>
            Silver is also said to have inherent skin-friendly characteristics, making
            it appropriate for delicate skin. Whether you select a pure jewellery
            silver necklace or a fashionable silver necklace for girls, everyday wear
            items offer a touch of refinement to your style while being comfortable
            and durable. A silver necklace for women is one of the most versatile and
            beautiful accessories for regular use.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            How to Identify a Real Pure Silver Necklace Set for Women
          </h2>
          <p>
            Identifying a genuine pure silver necklace set for women is critical to
            obtaining genuine quality and long-lasting lustre. To ensure authenticity,
            search for the 925 hallmark, which indicates that the item is composed of
            92.5% pure silver. A genuine silver necklace for women will usually have
            this mark on the clasp or back of the pendant.
          </p>
          <p>
            Real silver also has a natural lustre and a somewhat cool touch, as
            opposed to false metals, which feel excessively light or overly shiny. You
            may also do a simple magnet test — pure silver is not magnetic and should
            not attach to a magnet. High-quality silver necklaces for women are
            properly polished and do not have an unduly yellow or dull tone.
          </p>

          <p>
            If you love pairing elegant accessories together, explore our premium <Link
              href="https://www.mysabri.in/bracelets"
              className="hover:underline"
            > Pure Silver Bracelet for Men </Link> and stylish 925 silver bracelets collection. Just like our necklaces, these bracelets are handcrafted using genuine 92.5 sterling silver, offering long-lasting shine, durability, and everyday comfort. Discover matching designs that perfectly complement your necklace choices for a complete and refined look.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Best Silver Necklace for Women Gift Ideas for Every Budget
          </h2>
          <p>
            Finding the ideal silver necklace for women as a present is simple when
            there are options for any budget. Whether you're buying for a birthday,
            an anniversary, or a festive occasion, Mysabri has gorgeous designs that
            make thoughtful and elegant gifts. Our assortment comprises simple chains,
            attractive pendants, long necklaces, and premium pure silver necklace sets
            that are appropriate for women of all ages.
          </p>
          <p>
            Elegant daily-wear patterns start at just ₹1399, making it simple to
            surprise your loved ones without overpaying. If you want something more
            special, explore our handcrafted silver necklace set for women or
            traditional pearl choker necklace styles that provide a rich touch.
          </p>
          <p>
            Mysabri makes gifting simple with a variety of unique styles and budgets,
            delivering the finest silver necklace for women that complements any event
            beautifully.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Why Mysabri Is the Best Place to Buy Silver Necklace for Women Online
          </h2>
          <p>
            Mysabri is the ideal place to buy a silver necklace for women online
            because we prioritise high quality, fair pricing, and fashionable designs
            that complement any personality. All of our necklaces are made from
            certified 925 pure silver, which ensures long-lasting lustre, durability,
            and skin-friendly comfort. Whether you like minimalist chains, exquisite
            pendants, or a fine silver necklace set for women, each piece is crafted
            with precision and attention to detail.
          </p>
          <p>
            We provide affordable, high-quality jewellery beginning at ₹1399,
            allowing you to enjoy luxury designs without the hefty cost. Our
            selection includes trendy fashion pieces, classic traditional designs, and
            exquisite jewellery silver necklaces for women, all suitable for gifts or
            daily use.
          </p>
          <p>
            Mysabri continues to be the best place to buy a gorgeous silver necklace
            for women online, thanks to its trusted quality, authentic hallmark
            certification, and quick shipping.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-black">
            Care Tips to Maintain the Shine of Your Silver Necklace for Women
          </h2>
          <p>
            Proper maintenance guarantees that your silver necklace for women remains
            shining, elegant, and long-lasting. To avoid tarnishing, always store
            your silver jewellery in an airtight box or pouch. After wearing your
            necklace, carefully clean it with a soft cloth to remove any perspiration,
            perfume, or dust. This helps to keep the natural lustre of your silver
            necklace.
          </p>
          <p>
            Avoid wearing your necklace when swimming, bathing, or exercising, since
            chlorine, dampness, and perspiration might dull its lustre. For a more
            thorough cleaning, apply a moderate silver polish or a gentle soap-water
            solution. If you have a pure silver necklace set for women with
            intricate patterns, clean them gently to retain the delicate details.
          </p>
          <p>
            By following these simple maintenance instructions, your silver necklace
            for women will remain sparkling and luminous for years, making any
            ensemble exquisite and timeless.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-black">
            FAQs – Silver Necklace for Women
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
