"use client";

import { useState, use, useEffect } from "react";
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

// Standalone products data - you can replace this with your own data source
const products = [
  {
    id: "1",
    name: "Classic Diwali Gift Hamper",
    price: 1996,
    originalPrice: 4699,
    discount: 58,
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    category: "Gift Hampers",
    isOnSale: true,
    isNew: true,
    rating: 5,
    description: "Elegant Diwali gift hamper with premium jewelry pieces",
  },
  {
    id: "2",
    name: "Elegant Diwali Gift Hamper",
    price: 2193,
    originalPrice: 5049,
    discount: 57,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    category: "Gift Hampers",
    isOnSale: true,
    isNew: true,
    rating: 4.5,
    description: "Premium Diwali gift hamper with luxury jewelry collection",
    sku: "DG-BUNDLE-3",
  },
  {
    id: "3",
    name: "Grand Diwali Gift Hamper",
    price: 2384,
    originalPrice: 5699,
    discount: 58,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    category: "Gift Hampers",
    isOnSale: true,
    isNew: true,
    rating: 4.8,
    description: "Grand Diwali gift hamper with exclusive jewelry pieces",
  },
];

export default function NewArrivalsProductPage({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeProductsTab, setActiveProductsTab] = useState("related");

  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);
  
  // Find the product by slug (ID)
  const product = products.find((p) => p.id === resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Product Not Found
            </h1>
            <Link
              href="/new-arrivals"
              className="text-blue-600 hover:underline"
            >
              Back to New Arrivals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = [product.image, product.hoverImage].filter(Boolean);
  const thumbImages = [product.image, product.hoverImage || product.image, product.image];

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
    // Add to cart logic here
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Related products (others from this list)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 8);

  // Recently viewed (localStorage)
  useEffect(() => {
    try {
      const key = "recentlyViewedNewArrivals";
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const list = raw ? JSON.parse(raw) : [];
      const next = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 12);
      window.localStorage.setItem(key, JSON.stringify(next));
      const items = next
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean)
        .filter((p) => p.id !== product.id)
        .slice(0, 8);
      setRecentProducts(items);
    } catch {}
  }, [product.id]);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4 pt-40">
        <Link
          href="/new-arrivals"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to New Arrivals</span>
        </Link>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
              />

              <button className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                <Share2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleWishlist}
                className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pb-6">
              {([product.image, product.hoverImage || product.image, product.image]).map((src, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden border ${
                    selectedImage === index ? "border-neutral-900" : "border-neutral-200"
                  }`}
                >
                  <Image src={src} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 group">
            <div>
              <h1 className="text-2xl text-black mb-3">{product.name}</h1>

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
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20">
                    <defs>
                      <linearGradient id="halfStar">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#halfStar)"
                      d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating || 2})
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    MRP ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl text-black">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.discount && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    {product.discount}% OFF
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

            <div className="flex items-center gap-2 text-green-600 mt-8">
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

            <div className="mt-5">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-black text-white py-4 px-6 text-sm font-medium hover:bg-gray-800 transition-[transform,background-color] duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] disabled:opacity-50 flex items-center justify-center gap-2 rounded-md min-h-[55px] transform-gpu will-change-transform hover:translate-x-[3px] shake-attention"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "ADD TO BAG"}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-14 h-14 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center rounded-md"
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

              <button className="w-full bg-black text-white py-4 px-6 text-sm font-medium hover:bg-gray-800 transition-colors rounded-md min-h-[55px]">
                BUY IT NOW
              </button>
            </div>

            <div className="space-y-0 mt-8">
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
                        "Shine brighter this festive season with this elegant jewelry piece. Curated for those who love a perfect balance of glamour and grace, this item reflects brilliance in every detail."}
                    </p>
                  </div>
                )}
              </div>

              {/* Supplier Information */}
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
                    <p><span className="font-medium text-gray-700">Brand owned and marketed by:</span> Demifine Fashion Private Limited</p>
                    <p>CLUB HOUSE, S NO. 26/13/B/1A25/B, WINTERBERRY PURPLE CO-OPERATIVE HOUSING SOCIETY LIMITED, KOREGAON PARK, LANE NO.8, Pune, Maharashtra, 411001</p>
                    <p><span className="font-medium text-gray-700">Country of origin:</span> India</p>
                    <p><span className="font-medium text-gray-700">Brand:</span> Sabri</p>
                  </div>
                )}
              </div>

              {/* Return & Exchange Policy */}
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
                    <p>1. Enjoy hassle-free returns within 2 days of delivery. Products must be unused and packed with original tags.</p>
                    <p>2. Refunds are processed within 7–10 working days after pickup and verification.</p>
                    <p>3. Return of Products purchased under Buy 1 Get 1 or related offers would be eligible for refund to Wallet.</p>
                    <p>Exchange Policy – Within 10 Days: Damaged/Wrong Item/Size Issue – Exchange with same item; if unavailable, we’ll assist with the closest variant or refund.</p>
                  </div>
                )}

                
              </div>
            </div>

            {/* Visual Trio Section (warranty/quality images) */}
            <div className="mt-6 bg-[#F1EEE4] p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-3">
                {/* Lifetime Warranty */}
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
                  <span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">
                    Lifetime Warranty
                  </span>
                </div>

                {/* Skin Safe Jewellery */}
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
                  <span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">
                    Skin Safe Jewellery
                  </span>
                </div>

                {/* 18k Gold Tone Plated */}
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
                  <span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">
                    18k Gold Tone Plated
                  </span>
                </div>
              </div>
            </div>

            

     


             {/* Typically arrives text */}
             <p className="text-base md:text-lg text-neutral-900 my-4 px-2">
                Typically arrives in{' '}
                <span className="bg-[#C69A75] text-white px-1 rounded">
                  3-4 Days
                </span>
              </p>


              {/*Service Feature Section */}

              <section className="py-8 border-t border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-black">2 Days Return</span>
                    </div>
                    
                    <div className="hidden md:block text-gray-300">|</div>
                    
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-black">10 Days Exchange</span>
                    </div>
                    
                    <div className="hidden md:block text-gray-300">|</div>
                    
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-black">Cash On Delivery</span>
                    </div>
                  </div>
                </div>
              </section>

          </div>
        </div>

               {/* Related / Recently viewed tabs */}
               {(relatedProducts.length > 0 || recentProducts.length > 0) && (
              <section className="mt-12">
                <div className="flex items-center gap-8 justify-start">
                  <button
                    onClick={() => setActiveProductsTab("related")}
                    className="relative pb-2 text-2xl font-medium text-neutral-900"
                  >
                    Related Products
                    <span className={`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 ${activeProductsTab === "related" ? "w-full" : "w-0"}`}></span>
                  </button>
                  <button
                    onClick={() => setActiveProductsTab("recent")}
                    className="relative pb-2 text-2xl font-medium text-neutral-900"
                  >
                    Recently Viewed
                    <span className={`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 ${activeProductsTab === "recent" ? "w-full" : "w-0"}`}></span>
                  </button>
                </div>
                {activeProductsTab === "related" && relatedProducts.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((rp) => (
                      <Link key={rp.id} href={`/new-arrivals/${rp.id}`} className="group border border-neutral-200">
                        <div className="relative aspect-square overflow-hidden">
                          <Image src={rp.image} alt={rp.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="px-2 py-2">
                          <div className="line-clamp-1 text-sm text-neutral-900">{rp.name}</div>
                          <div className="mt-1 flex items-center gap-2 text-[13px]">
                            <span className="font-medium text-neutral-900">₹{rp.price.toLocaleString()}</span>
                            {rp.originalPrice && (
                              <span className="text-neutral-500 line-through">₹{rp.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {activeProductsTab === "recent" && recentProducts.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recentProducts.map((rv) => (
                      <Link key={rv.id} href={`/new-arrivals/${rv.id}`} className="group border border-neutral-200">
                        <div className="relative aspect-square overflow-hidden">
                          <Image src={rv.image} alt={rv.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="px-2 py-2">
                          <div className="line-clamp-1 text-sm text-neutral-900">{rv.name}</div>
                          <div className="mt-1 flex items-center gap-2 text-[13px]">
                            <span className="font-medium text-neutral-900">₹{rv.price.toLocaleString()}</span>
                            {rv.originalPrice && (
                              <span className="text-neutral-500 line-through">₹{rv.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

        
      </div>

      
    </div>
  );
}
