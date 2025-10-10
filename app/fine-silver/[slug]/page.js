"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ArrowLeft, Share2, Plus, Minus } from "lucide-react";

// Sample product data - replace with your actual data
const productData = {
  fs1: {
    id: "fs1",
    name: "925 Sterling Silver Ring",
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
    ],
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.8,
    reviews: 89,
    description:
      "Premium 925 sterling silver ring with elegant design. Crafted with precision and attention to detail.",
    features: [
      "925 Sterling Silver",
      "Handcrafted",
      "Hypoallergenic",
      "Lifetime Warranty",
    ],
  },
  fs2: {
    id: "fs2",
    name: "Silver Chain Necklace",
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    ],
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.9,
    reviews: 156,
    description:
      "Classic silver chain necklace for everyday elegance. Perfect for layering or wearing alone.",
    features: [
      "925 Sterling Silver",
      "Adjustable Length",
      "Tarnish Resistant",
      "Gift Box Included",
    ],
  },
};

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openDesc, setOpenDesc] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeProductsTab, setActiveProductsTab] = useState("related");

  const product = productData[resolvedParams.slug];

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <Link href="/fine-silver" className="text-blue-600 hover:underline">
            Back to Fine Silver
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
    console.log("Added to cart:", product.name, "Quantity:", quantity);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const relatedProducts = Object.values(productData)
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  useEffect(() => {
    try {
      const key = "recentlyViewedFineSilver";
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const list = raw ? JSON.parse(raw) : [];
      const next = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 12);
      window.localStorage.setItem(key, JSON.stringify(next));
      const productsFromIds = next
        .map((id) => productData[id])
        .filter(Boolean)
        .filter((p) => p.id !== product.id)
        .slice(0, 8);
      setRecentProducts(productsFromIds);
    } catch {}
  }, [product.id]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 pt-40">
        <Link
          href="/fine-silver"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fine Silver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg relative">
              <Image
                src={product.gallery[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={handleWishlist} className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors">
                <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {product.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? "border-gray-800"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              <p className="text-sm text-gray-500">SKU: {product.id}</p>
              <div className="mt-2">
                <button className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors">See All Offers</button>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">In stock - ready to ship</span>
              </div>

              {/* <div className="space-y-1">
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
                  <span className="bg-black text-white px-3 py-1 text-xs">
                    SAVE {product.discount}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              <p className="text-sm text-gray-500">
                SKU: {product.sku || product.id}
              </p>
            </div> */}








              

              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-[transform,background-color] duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] disabled:opacity-50 flex items-center justify-center gap-2 transform-gpu will-change-transform hover:translate-x-[3px] shake-attention"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isAddingToCart ? "Adding..." : "ADD TO BAG"}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-3 border rounded hover:bg-gray-50 transition-colors ${
                      isWishlisted
                        ? "border-red-500 text-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
                <button className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors">BUY IT NOW</button>
              </div>
            </div>

                          {/* Accordions */}
                          <div className="space-y-0">
                <div className="bg-gray-50 p-4 rounded-md">
                  <button onClick={() => setOpenDesc(!openDesc)} className="w-full flex items-center justify-between text-left">
                    <span className="text-sm font-medium text-gray-500">Description</span>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">{openDesc ? <Minus className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-white" />}</div>
                  </button>
                  {openDesc && (
                    <div className="mt-3 text-sm text-neutral-700 leading-relaxed">
                      <p>{product.description}</p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <button onClick={() => setOpenSupplier(!openSupplier)} className="w-full flex items-center justify-between text-left">
                    <span className="text-sm font-medium text-gray-500">Supplier Information</span>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">{openSupplier ? <Minus className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-white" />}</div>
                  </button>
                  {openSupplier && (
                    <div className="mt-3 text-sm text-neutral-700 leading-relaxed space-y-1">
                      <p><span className="font-medium">Brand owned and marketed by:</span> Demifine Fashion Private Limited</p>
                      <p>CLUB HOUSE, S NO. 26/13/B/1A25/B, WINTERBERRY PURPLE CO-OPERATIVE HOUSING SOCIETY LIMITED, KOREGAON PARK, LANE NO.8, Pune, Maharashtra, 411001</p>
                      <p><span className="font-medium">Country of origin:</span> India</p>
                      <p><span className="font-medium">Brand:</span> Sabri</p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <button onClick={() => setOpenReturns(!openReturns)} className="w-full flex items-center justify-between text-left">
                    <span className="text-sm font-medium text-gray-500">Return & Exchange Policy</span>
                    <div className="w-12 h-12 bg-black rounded flex items-center justify-center">{openReturns ? <Minus className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-white" />}</div>
                  </button>
                  {openReturns && (
                    <div className="mt-3 text-sm text-neutral-700 leading-relaxed space-y-2">
                      <p>1. Enjoy hassle-free returns within 2 days of delivery. Products must be unused and packed with original tags.</p>
                      <p>2. Refunds are processed within 7–10 working days after pickup and verification.</p>
                      <p>3. Return of Products purchased under Buy 1 Get 1 or other related offers would be eligible for refund to Wallet.</p>
                      <p>Exchange Policy – Within 10 Days: Damaged/Wrong Item/Size Issue – Exchange with same item; if unavailable, we’ll assist with the closest variant or refund.</p>
                    </div>
                  )}
                </div>
              </div>

            {/* Visual Trio Section */}
            <div className="mt-6 bg-[#F1EEE4] p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" /><path d="M9 12l2 2 4-4" /></svg><span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">Lifetime Warranty</span></div>
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-12A8 8 0 0 0 4 10c0 8 8 12 8 12z" /><path d="M9 11l2 2 4-4" /></svg><span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">Skin Safe Jewellery</span></div>
                <div className="aspect-square bg-white rounded-lg shadow-sm flex flex-col items-center justify-center text-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3 5 6 .9-4.5 4.4 1 6-5.5-3-5.5 3 1-6L3 7.9 9 7l3-5z" /></svg><span className="mt-2 text-[12px] font-medium leading-snug text-neutral-900">18k Gold Tone Plated</span></div>
              </div>
            </div>

            <p className="text-base md:text-lg text-neutral-900 my-4 px-2">Typically arrives in <span className="bg-[#C69A75] text-white px-1 rounded">3-4 Days</span></p>

            <section className="py-8 border-t border-b border-gray-200 bg-white">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex items-center"><span className="text-lg font-medium text-black">2 Days Return</span></div>
                  <div className="hidden md:block text-gray-300">|</div>
                  <div className="flex items-center"><span className="text-lg font-medium text-black">10 Days Exchange</span></div>
                  <div className="hidden md:block text-gray-300">|</div>
                  <div className="flex items-center"><span className="text-lg font-medium text-black">Cash On Delivery</span></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {(relatedProducts.length > 0 || recentProducts.length > 0) && (
        <section className="mt-12 container mx-auto px-4">
          <div className="flex items-center gap-8">
            <button onClick={() => setActiveProductsTab("related")} className="relative pb-2 text-2xl font-medium text-neutral-900">Related Products<span className={`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 ${activeProductsTab === "related" ? "w-full" : "w-0"}`}></span></button>
            <button onClick={() => setActiveProductsTab("recent")} className="relative pb-2 text-2xl font-medium text-neutral-900">Recently Viewed<span className={`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 ${activeProductsTab === "recent" ? "w-full" : "w-0"}`}></span></button>
          </div>
          {activeProductsTab === "related" && relatedProducts.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/fine-silver/${rp.id}`} className="group border border-neutral-200">
                  <div className="relative aspect-square overflow-hidden"><Image src={rp.image || rp.gallery?.[0]} alt={rp.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="px-2 py-2">
                    <div className="line-clamp-1 text-sm text-neutral-900">{rp.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[13px]"><span className="font-medium text-neutral-900">₹{rp.price.toLocaleString()}</span>{rp.originalPrice && (<span className="text-neutral-500 line-through">₹{rp.originalPrice.toLocaleString()}</span>)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {activeProductsTab === "recent" && recentProducts.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentProducts.map((rv) => (
                <Link key={rv.id} href={`/fine-silver/${rv.id}`} className="group border border-neutral-200">
                  <div className="relative aspect-square overflow-hidden"><Image src={rv.image || rv.gallery?.[0]} alt={rv.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="px-2 py-2">
                    <div className="line-clamp-1 text-sm text-neutral-900">{rv.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[13px]"><span className="font-medium text-neutral-900">₹{rv.price.toLocaleString()}</span>{rv.originalPrice && (<span className="text-neutral-500 line-through">₹{rv.originalPrice.toLocaleString()}</span>)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
