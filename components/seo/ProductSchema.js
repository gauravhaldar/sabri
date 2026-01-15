"use client";

export default function ProductSchema({ product }) {
  if (!product) return null;

  const baseUrl = "https://www.mysabri.in";
  const categoryPath = product.category || "best-sellers";
  const productPath = product.slug || product._id;
  const productUrl = `${baseUrl}/${categoryPath}/${productPath}`;
  const primaryImage = product.images?.[0] || "";
  
  // Calculate price and availability
  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const hasDiscount = originalPrice > price;
  const inStock = (product.stock || 0) > 0;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    url: productUrl,
    image: primaryImage,
    brand: {
      "@type": "Brand",
      name: product.brand || "Sabri"
    },
    sku: product.sku,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Sabri Jewellery",
        url: baseUrl
      }
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Material",
        value: product.specifications?.material || "Silver"
      },
      {
        "@type": "PropertyValue", 
        name: "Metal Type",
        value: product.specifications?.metalType || "925 Sterling Silver"
      }
    ]
  };

  // Add discount information if available
  if (hasDiscount) {
    schema.offers.highPrice = originalPrice;
    schema.offers.lowPrice = price;
  }

  // Add aggregate rating if available
  if (product.averageRating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.purchaseCount || 1,
      bestRating: 5,
      worstRating: 1
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}
