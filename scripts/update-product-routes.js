#!/usr/bin/env node

/**
 * Script to update all product routes to use dynamic data fetching
 * This script will help identify which routes need to be updated
 */

const fs = require("fs");
const path = require("path");

// List of all product routes that need to be updated
const productRoutes = [
  "earrings",
  "necklaces",
  "mens",
  "gifts",
  "collections",
  "fine-gold",
  "fine-silver",
  "best-sellers",
  "new-arrivals",
];

// Template for updating page.js files
const pageTemplate = (category) => `
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";
import { useProducts } from "../../hooks/useProducts";
import { getProductImageUrl, getProductDisplayPrice, isProductOnSale, filterProducts, sortProducts } from "../../lib/productUtils";

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
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);
  const rating = product.rating?.average || 0;

  return (
    <div className="bg-white group">
      <Link href={\`/${category}/\${product.slug || product.id}\`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 left-2 p-1.5 bg-white/90 hover:bg-white rounded-full transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <Heart
              className={\`h-3 w-3 \${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
              }\`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-2 right-2 bg-white border border-black text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            {isAddingToCart ? "Adding..." : "ADD TO BAG"}
          </button>
          {isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
              {discount}% OFF
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={\`/${category}/\${product.slug || product.id}\`}>
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
                className={\`w-3 h-3 \${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}\`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-light">
            ({rating.toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ${
  category.charAt(0).toUpperCase() + category.slice(1)
}Page() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({ priceMin: "", priceMax: "", onSale: false, minRating: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { products, loading, error } = useProducts('${category}', filters);
  
  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = sortProducts(filteredProducts, sortBy);

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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Products</h2>
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
      <div className="bg-gray-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">${
              category.charAt(0).toUpperCase() + category.slice(1)
            }</h1>
            <p className="text-gray-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button onClick={() => setFiltersOpen(true)} className="px-3 py-2 border border-neutral-900 text-neutral-900 text-sm bg-white hover:bg-neutral-50 whitespace-nowrap">Filters</button>
              <div className="flex items-center w-full sm:w-auto">
                <label className="mr-2 text-sm text-gray-700 whitespace-nowrap">Sort by:</label>
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
            <FiltersDrawer open={filtersOpen} value={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 hover:bg-gray-50 transition-colors duration-200">
                Load More
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products in this category.
            </p>
            <a
              href="/"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
`;

// Template for updating [slug]/page.js files
const productPageTemplate = (category) => `
"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Plus, Minus, ShoppingBag } from "lucide-react";
import { transformProductFromBackend, transformProductsFromBackend, getProductImageUrl, getProductDisplayPrice, isProductOnSale } from "../../../lib/productUtils";

export default function ${
  category.charAt(0).toUpperCase() + category.slice(1)
}ProductPage({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeProductsTab, setActiveProductsTab] = useState("related");
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
        const response = await fetch(\`/api/products/slug/\${resolvedParams.slug}\`);
        const data = await response.json();
        
        if (data.success) {
          const transformedProduct = transformProductFromBackend(data.data.product);
          setProduct(transformedProduct);
          
          // Fetch related products
          if (transformedProduct.id) {
            const relatedResponse = await fetch(\`/api/products/related/\${transformedProduct.id}\`);
            const relatedData = await relatedResponse.json();
            if (relatedData.success) {
              const transformedRelated = transformProductsFromBackend(relatedData.data.products);
              setRelatedProducts(transformedRelated);
            }
          }
        } else {
          setError(data.message || 'Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (product) {
      try {
        const key = \`recentlyViewed${
          category.charAt(0).toUpperCase() + category.slice(1)
        }\`;
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
        const list = raw ? JSON.parse(raw) : [];
        const next = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 12);
        window.localStorage.setItem(key, JSON.stringify(next));
        setRecentProducts(next.slice(1, 9)); // Skip the first one as it's the current product
      } catch {}
    }
  }, [product?.id]);

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
            <Link href="/${category}" className="text-blue-600 hover:underline">
              Back to ${category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.map(img => img.url) || [getProductImageUrl(product)];
  const { current, original, discount } = getProductDisplayPrice(product);
  const isOnSale = isProductOnSale(product);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAddingToCart(false);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 pt-40">
        <Link
          href="/${category}"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to ${
            category.charAt(0).toUpperCase() + category.slice(1)
          }</span>
        </Link>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={images[selectedImage] || getProductImageUrl(product)}
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
                  className={\`h-4 w-4 \${
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                  }\`}
                />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 pb-6">
              {images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={\`relative aspect-square overflow-hidden border \${selectedImage === index ? "border-neutral-900" : "border-neutral-200"}\`}
                >
                  <Image src={src} alt={\`\${product.name} \${index + 1}\`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl text-black mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gray-600 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating?.average || 0})
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {original > current && (
                  <span className="text-lg text-gray-500 line-through">
                    MRP ₹{original.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl text-black">
                  ₹{current.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
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
                    className={\`h-5 w-5 \${
                      isWishlisted
                        ? "text-red-500 fill-current"
                        : "text-gray-600"
                    }\`}
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
                        "Shine brighter this festive season with this elegant piece. Curated for those who love a perfect balance of glamour and grace, this item reflects brilliance in every detail."}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <button
                  onClick={() => toggleSection("supplier")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-500">Supplier Information</span>
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
              <div className="bg-gray-50 p-4 rounded-md">
                <button
                  onClick={() => toggleSection("returns")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-500">Return & Exchange Policy</span>
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
                    <p>Exchange Policy – Within 10 Days: Damaged/Wrong Item/Size Issue – Exchange with same item; if unavailable, we'll assist with the closest variant or refund.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related / Recently viewed tabs */}
      {(relatedProducts.length > 0 || recentProducts.length > 0) && (
        <section className="mt-12 container mx-auto px-4">
          <div className="flex items-center gap-8 justify-start">
            <button onClick={() => setActiveProductsTab("related")} className="relative pb-2 text-2xl font-medium text-neutral-900">
              Related Products
              <span className={\`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 \${activeProductsTab === "related" ? "w-full" : "w-0"}\`}></span>
            </button>
            <button onClick={() => setActiveProductsTab("recent")} className="relative pb-2 text-2xl font-medium text-neutral-900">
              Recently Viewed
              <span className={\`absolute left-0 -bottom-[1px] h-[2px] bg-neutral-900 transition-all duration-300 \${activeProductsTab === "recent" ? "w-full" : "w-0"}\`}></span>
            </button>
          </div>
          {activeProductsTab === "related" && relatedProducts.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => {
                const rpImage = getProductImageUrl(rp);
                const rpPrice = getProductDisplayPrice(rp);
                return (
                  <Link key={rp.id} href={\`/${category}/\${rp.slug || rp.id}\`} className="group border border-neutral-200">
                    <div className="relative aspect-square overflow-hidden">
                      <Image src={rpImage} alt={rp.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="px-2 py-2">
                      <div className="line-clamp-1 text-sm text-neutral-900">{rp.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-[13px]">
                        <span className="font-medium text-neutral-900">₹{rpPrice.current.toLocaleString()}</span>
                        {rpPrice.original > rpPrice.current && (
                          <span className="text-neutral-500 line-through">₹{rpPrice.original.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
`;

console.log("Product Routes Update Script");
console.log("===========================");
console.log("");
console.log("Routes that need to be updated:");
productRoutes.forEach((route, index) => {
  console.log(`${index + 1}. ${route}`);
});
console.log("");
console.log("To update each route:");
console.log("1. Replace the page.js file with the template above");
console.log(
  "2. Replace the [slug]/page.js file with the product page template"
);
console.log("3. Update the category parameter in useProducts() call");
console.log("");
console.log("Templates are ready to use!");

