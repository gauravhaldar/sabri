/**
 * Product utility functions for filtering, sorting, and data transformation
 */

/**
 * Filter products based on criteria
 * @param {Array} products - Array of products to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export function filterProducts(products, filters) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter((product) => {
    // Price range filter
    if (
      filters.priceMin !== undefined &&
      filters.priceMin !== "" &&
      product.price < Number(filters.priceMin)
    ) {
      return false;
    }
    if (
      filters.priceMax !== undefined &&
      filters.priceMax !== "" &&
      product.price > Number(filters.priceMax)
    ) {
      return false;
    }

    // Sale filter
    if (filters.onSale && !product.isOnSale && !isProductOnSale(product)) {
      return false;
    }

    // Rating filter
    if (filters.minRating && filters.minRating > 0) {
      const rating = Number(
        product.averageRating || product.rating?.average || product.rating || 0
      );
      if (isNaN(rating) || rating < filters.minRating) {
        return false;
      }
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    return true;
  });
}

/**
 * Sort products based on criteria
 * @param {Array} products - Array of products to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export function sortProducts(products, sortBy) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const sortedProducts = [...products];

  switch (sortBy) {
    case "price-asc":
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));

    case "price-desc":
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));

    case "rating-desc":
      return sortedProducts.sort((a, b) => {
        const ratingA = a.averageRating || a.rating?.average || a.rating || 0;
        const ratingB = b.averageRating || b.rating?.average || b.rating || 0;
        return ratingB - ratingA;
      });

    case "name-asc":
      return sortedProducts.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

    case "newest":
      return sortedProducts.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

    case "featured":
    default:
      // Keep original order (usually sorted by relevance/popularity from API)
      return sortedProducts;
  }
}

/**
 * Convert character array to string (for image URLs stored as character arrays)
 * @param {Array|string} imageData - Image data as character array or string
 * @returns {string} Image URL
 */
export function convertCharArrayToString(imageData) {
  if (typeof imageData === "string") return imageData;
  if (Array.isArray(imageData)) {
    return imageData.join("");
  }
  if (typeof imageData === "object" && imageData !== null) {
    // Handle character array objects like {'0': 'h', '1': 't', ...}
    // Only process numeric keys, ignore metadata properties
    const numericKeys = Object.keys(imageData)
      .filter((key) => /^\d+$/.test(key)) // Only numeric keys
      .sort((a, b) => parseInt(a) - parseInt(b));

    if (numericKeys.length === 0) {
      return ""; // No numeric keys found, not a character array
    }

    const chars = numericKeys.map((key) => imageData[key]);
    return chars.join("");
  }
  return "";
}

/**
 * Get product image URL with fallback
 * @param {Object} product - Product object
 * @returns {string} Image URL
 */
export function getProductImageUrl(product) {
  if (!product) return "/placeholder-image.jpg";

  // Try different image field names
  if (product.image) {
    const imageUrl = convertCharArrayToString(product.image);
    if (imageUrl) return imageUrl;
  }

  if (product.images && product.images.length > 0) {
    // Handle images array - could be character arrays or strings
    const firstImage = product.images[0];
    const imageUrl = convertCharArrayToString(firstImage);
    if (imageUrl) return imageUrl;
  }

  if (product.imageUrl) {
    const imageUrl = convertCharArrayToString(product.imageUrl);
    if (imageUrl) return imageUrl;
  }

  return "/placeholder-image.jpg";
}

/**
 * Get product display price information
 * @param {Object} product - Product object
 * @returns {Object} Price information
 */
export function getProductDisplayPrice(product) {
  if (!product) {
    return { current: 0, original: 0, discount: 0 };
  }

  const current = product.price || product.currentPrice || 0;
  const original = product.originalPrice || product.regularPrice || current;
  const discount =
    original > current
      ? Math.round(((original - current) / original) * 100)
      : 0;

  return {
    current,
    original,
    discount,
  };
}

/**
 * Check if product is on sale
 * @param {Object} product - Product object
 * @returns {boolean} Whether product is on sale
 */
export function isProductOnSale(product) {
  if (!product) return false;

  // Check explicit sale flag
  if (product.isOnSale !== undefined) return product.isOnSale;

  // Check if current price is less than original price
  const current = product.price || product.currentPrice || 0;
  const original = product.originalPrice || product.regularPrice || current;

  return original > current;
}

/**
 * Transform products from backend format to frontend format
 * @param {Array} products - Products from backend
 * @returns {Array} Transformed products
 */
export function transformProductsFromBackend(products) {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.map((product) => {
    // Process images array to extract URLs
    const processedImages = [];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (typeof img === "string") {
          processedImages.push(img);
        } else if (typeof img === "object" && img !== null) {
          // Handle character array format - process objects that have numeric keys
          const imageUrl = convertCharArrayToString(img);
          if (imageUrl && imageUrl.startsWith("http")) {
            processedImages.push(imageUrl);
          }
        }
      });
    }

    return {
      ...product,
      // Ensure consistent field names
      id: product._id || product.id,
      name: product.name || product.title || "",
      price: product.price || product.currentPrice || 0,
      originalPrice: product.originalPrice || product.regularPrice,
      image: getProductImageUrl(product),
      images: processedImages,
      hoverImage:
        product.hoverImage ||
        product.secondaryImage ||
        processedImages[1] ||
        null,
      isOnSale: isProductOnSale(product),
      averageRating: Number(
        product.averageRating || product.rating?.average || product.rating || 0
      ),
      rating: {
        average: Number(
          product.averageRating ||
            product.rating?.average ||
            product.rating ||
            0
        ),
        count: Number(product.ratingCount || product.rating?.count || 0),
      },
      // Add slug for routing if not present
      slug: product.slug || product._id || product.id,
    };
  });
}

/**
 * Transform single product from backend format to frontend format
 * @param {Object} product - Product from backend
 * @returns {Object} Transformed product
 */
export function transformProductFromBackend(product) {
  if (!product) return null;

  const transformed = transformProductsFromBackend([product]);
  return transformed[0] || null;
}
