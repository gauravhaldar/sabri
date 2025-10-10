"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import FiltersDrawer from "../components/FiltersDrawer";

const products = [
  {
    id: "fs1",
    name: "925 Sterling Silver Ring",
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    hoverImage:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.8,
    description: "Premium 925 sterling silver ring with elegant design",
  },
  {
    id: "fs2",
    name: "Silver Chain Necklace",
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.9,
    description: "Classic silver chain necklace for everyday elegance",
  },
  {
    id: "fs3",
    name: "Silver Hoop Earrings",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.7,
    description: "Timeless silver hoop earrings for any occasion",
  },
  {
    id: "fs4",
    name: "Silver Bracelet Set",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    category: "Fine Silver",
    isOnSale: true,
    rating: 4.8,
    description: "Elegant silver bracelet set with matching pieces",
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

  return (
    <div className="bg-white group">
      <Link href={`/fine-silver/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
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
            disabled={isAddingToCart}
            className="absolute bottom-2 right-2 bg-white border border-black text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            {isAddingToCart ? "Adding..." : "ADD TO BAG"}
          </button>
          {product.isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/fine-silver/${product.id}`}>
          <h3 className="text-xs font-light text-black mb-1.5 line-clamp-2 leading-tight hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-light text-black">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-500 line-through font-light">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-light">
                ({product.discount}%)
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-3 h-3 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-light">
            ({product.rating || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default function FineSilverPage() {
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({ priceMin: 0, priceMax: 50000, minRating: 0 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const baseProducts = products.filter((product) => product.category === "Fine Silver");
  const filteredProducts = baseProducts.filter((p) => {
    if (filters.minRating && (p.rating || 0) < filters.minRating) return false;
    if (filters.priceMin && (p.price || 0) < Number(filters.priceMin)) return false;
    if (filters.priceMax && (p.price || 0) > Number(filters.priceMax)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === "price-desc") {
      return (b.price || 0) - (a.price || 0);
    }
    return 0;
  });

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">Fine Silver</h1>
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
