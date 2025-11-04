"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";
import {
  transformProductFromBackend,
  transformProductsFromBackend,
  getProductImageUrl,
  getProductDisplayPrice,
  isProductOnSale,
} from "../../lib/productUtils";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function DynamicProductPage({
  params,
  categoryName,
  categoryRoute,
}) {
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const {
    toggleWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const toast = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products/slug/${resolvedParams.slug}`
        );
        const data = await response.json();

        if (data.success) {
          const transformedProduct = transformProductFromBackend(
            data.data.product
          );
          setProduct(transformedProduct);

          // Fetch related products
          if (transformedProduct.id) {
            const relatedResponse = await fetch(
              `/api/products/related/${transformedProduct.id}`
            );
            const relatedData = await relatedResponse.json();
            if (relatedData.success) {
              const transformedRelated = transformProductsFromBackend(
                relatedData.data.products
              );
              setRelatedProducts(transformedRelated);
            }
          }
        } else {
          setError(data.message || "Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              {error || "Product Not Found"}
            </h1>
            <Link
              href={`/${categoryRoute}`}
              className="text-blue-600 hover:underline"
            >
              Back to {categoryName}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.map((img) => {
    // Handle both object format (from backend) and string format
    if (typeof img === "object" && img.url) {
      return img.url;
    }
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }
    return getProductImageUrl(product);
  }) || [getProductImageUrl(product)];
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);

    try {
      const success = await addToCart(product.id, 1);
      if (success) {
        toast.success(`${product.name} added to cart successfully!`);
      } else {
        toast.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    if (!product) return;

    try {
      // Check current wishlist status before toggling
      const wasWishlisted = isInWishlist(product.id);
      const success = await toggleWishlist(product.id);

      if (success) {
        if (wasWishlisted) {
          toast.success(`${product.name} removed from wishlist!`);
        } else {
          toast.success(`${product.name} added to wishlist!`);
        }
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleBuyNow = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!product) return;
    try {
      // Ensure item is in cart, then navigate to cart
      if (!isInCart(product.id)) {
        await addToCart(product.id, 1);
      }
    } finally {
      window.location.href = "/cart";
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-3 sm:py-4 pt-28 sm:pt-40">
        <Link
          href={`/${categoryRoute}`}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm sm:text-base">Back to {categoryName}</span>
        </Link>
      </div>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
          <div className="space-y-4">
            <div
              className="relative overflow-hidden bg-gray-50"
              style={
                selectedImage === 1
                  ? { aspectRatio: "9/16" }
                  : { aspectRatio: "1/1" }
              }
            >
              <Image
                src={images[selectedImage] || getProductImageUrl(product)}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 pb-4 sm:pb-6">
              {(images[1]
                ? images
                : [
                    getProductImageUrl(product),
                    getProductImageUrl(product),
                    getProductImageUrl(product),
                  ]
              ).map((src, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden border ${
                    selectedImage === index
                      ? "border-neutral-900"
                      : "border-neutral-200"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl text-black mb-2 sm:mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gray-600 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  ({product.rating?.count || product.rating?.average || 2})
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {original > current && (
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    MRP ₹{original.toLocaleString()}
                  </span>
                )}
                <span className="text-xl sm:text-2xl text-black">
                  ₹{current.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              <p className="text-sm text-gray-500">
                SKU: {product.sku || product.id}
              </p>
            </div>
            <div className="mt-6">
              <button className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors">
                See All Offers
              </button>
            </div>

            {/* Stock Status Indicators */}
            {product.stock > 0 ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mt-6 sm:mt-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-1.5 h-1.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-green-600">
                    In stock - ready to ship
                  </span>
                </div>

                {/* Stock indicator - show "X Item left" when stock is below 3 */}
                {product.stock < 3 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {product.stock}{" "}
                      {product.stock === 1 ? "Item left" : "Items left"}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 sm:mt-8">
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Currently Unavailable
                  </span>
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock <= 0}
                  className={`flex-1 py-3 sm:py-4 px-5 sm:px-6 text-sm font-medium transition-[transform,background-color] duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] disabled:opacity-50 flex items-center justify-center gap-2 rounded-md min-h-[48px] sm:min-h-[55px] transform-gpu will-change-transform ${
                    product.stock <= 0
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800 hover:translate-x-[3px] shake-attention"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {product.stock <= 0
                    ? "SOLD OUT"
                    : isAddingToCart
                    ? "Adding..."
                    : product && isInCart(product.id)
                    ? "IN CART"
                    : "ADD TO BAG"}
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center rounded-md disabled:opacity-50"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? "text-red-500 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`w-full py-3 sm:py-4 px-5 sm:px-6 text-sm font-medium transition-colors rounded-md min-h-[48px] sm:min-h-[55px] ${
                  product.stock <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                BUY IT NOW
              </button>
            </div>
            <div className="space-y-0 mt-6 sm:mt-8">
              <div className="bg-gray-50 p-4 rounded-md">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-500">
                    Description
                  </span>
                  <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                    {expandedSections.description ? (
                      <Minus className="h-3 w-3 text-white" />
                    ) : (
                      <Plus className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
                {expandedSections.description && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description ||
                        `Shine brighter this festive season with this elegant ${categoryName.toLowerCase()}. Curated for those who love a perfect balance of glamour and grace, this item reflects brilliance in every detail.`}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <button
                  onClick={() => toggleSection("supplier")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-500">
                    Supplier Information
                  </span>
                  <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                    {expandedSections.supplier ? (
                      <Minus className="h-3 w-3 text-white" />
                    ) : (
                      <Plus className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
                {expandedSections.supplier && (
                  <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-1">
                    <p>
                      <span className="font-medium text-gray-700">
                        Brand owned and marketed by:
                      </span>{" "}
                      SABRI
                    </p>
                    <p>
                      Plot No 173, Engineering Park, Heavy Industrial Area,
                      Hathkhoj, Bhilai,490024, C.G.
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        Country of origin:
                      </span>{" "}
                      India
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Brand:</span>{" "}
                      Sabri
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <button
                  onClick={() => toggleSection("returns")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-500">
                    Return & Exchange Policy
                  </span>
                  <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                    {expandedSections.returns ? (
                      <Minus className="h-3 w-3 text-white" />
                    ) : (
                      <Plus className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
                {expandedSections.returns && (
                  <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-2">
                    <p>
                      1. Enjoy hassle-free returns within 2 days of delivery.
                      Products must be unused and packed with original tags.
                    </p>
                    <p>
                      2. Refunds are processed within 7–10 working days after
                      pickup and verification.
                    </p>
                    <p>
                      3. Return of Products purchased under Buy 1 Get 1 or
                      related offers would be eligible for refund to Wallet.
                    </p>
                    <p>
                      Exchange Policy – Within 10 Days: Damaged/Wrong Item/Size
                      Issue – Exchange with same item; if unavailable,
                      we&apos;ll assist with the closest variant or refund.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Trio Section */}
            <div className="mt-6 bg-[#F1EEE4] p-3 sm:p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-neutral-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="mt-2 text-[11px] sm:text-[12px] font-medium leading-snug text-neutral-900">
                    Lifetime Warranty
                  </span>
                </div>
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-neutral-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 22s8-4 8-12A8 8 0 0 0 4 10c0 8 8 12 8 12z" />
                    <path d="M9 11l2 2 4-4" />
                  </svg>
                  <span className="mt-2 text-[11px] sm:text-[12px] font-medium leading-snug text-neutral-900">
                    Skin Safe Jewellery
                  </span>
                </div>
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-neutral-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2l3 5 6 .9-4.5 4.4 1 6-5.5-3-5.5 3 1-6L3 7.9 9 7l3-5z" />
                  </svg>
                  <span className="mt-2 text-[11px] sm:text-[12px] font-medium leading-snug text-neutral-900">
                    18k Gold Tone Plated
                  </span>
                </div>
              </div>
            </div>

            <p className="text-base md:text-lg text-neutral-900 my-4 px-2">
              Typically arrives in{" "}
              <span className="bg-[#C69A75] text-white px-1 rounded">
                7-9 Days
              </span>
            </p>

            <section className="py-8 border-t border-b border-gray-200 bg-white">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-black">
                      2 Days Return
                    </span>
                  </div>
                  <div className="hidden md:block text-gray-300">|</div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-black">
                      10 Days Exchange
                    </span>
                  </div>
                  <div className="hidden md:block text-gray-300">|</div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-black">
                      Cash On Delivery
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="py-12 bg-white border-t border-neutral-200">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-medium text-neutral-900">
                      Customer Reviews
                    </h3>
                    <button className="px-6 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors">
                      Write a Review
                    </button>
                  </div>

                  {/* Reviews will only show for customers who have purchased this product */}
                  <div className="text-center py-12">
                    <div className="max-w-2xl mx-auto">
                      <h4 className="text-lg font-medium text-neutral-900 mb-4">
                        Not applicable — because there&apos;s only ever one.
                      </h4>
                      <p className="text-base text-neutral-700 leading-relaxed">
                        Every design is a single edition, handcrafted once and
                        never repeated. You&apos;re not just buying jewellery ~
                        you&apos;re claiming a piece that will never exist
                        again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-12 container mx-auto px-4">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-medium text-neutral-900">
              Related Products
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((rp) => {
              const rpImage = getProductImageUrl(rp);
              const rpPrice = getProductDisplayPrice(rp);
              return (
                <Link
                  key={rp.id}
                  href={`/${categoryRoute}/${rp.slug || rp.id}`}
                  className="group border border-neutral-200"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={rpImage}
                      alt={rp.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-2 py-2">
                    <div className="line-clamp-1 text-[13px] sm:text-sm text-neutral-900">
                      {rp.name}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[12px] sm:text-[13px]">
                      <span className="font-medium text-neutral-900">
                        ₹{rpPrice.current.toLocaleString()}
                      </span>
                      {rpPrice.original > rpPrice.current && (
                        <span className="text-neutral-500 line-through">
                          ₹{rpPrice.original.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
