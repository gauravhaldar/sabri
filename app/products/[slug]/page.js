import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import ProductSchema from "@/components/seo/ProductSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

// Server component: fetch product directly from DB by slug or _id
export default async function ProductDetailPage({ params }) {
  const { slug } = (await params) || {};

  await connectDB();

  // Find product by slug or id
  const product = await Product.findOne({
    $or: [{ slug }, { _id: slug }, { id: slug }],
    isActive: true,
  }).lean();

  if (!product) {
    notFound();
  }

  const price = product.price ?? 0;
  const originalPrice = product.originalPrice || 0;
  const hasDiscount = originalPrice > price;
  const primaryImage =
    (product.images && product.images[0]) || "/placeholder-image.jpg";

  // Generate breadcrumbs for SEO
  const breadcrumbs = [
    { name: "Home", url: "https://www.mysabri.in" },
    { name: product.category?.replace(/-/g, " ") || "Products", url: `https://www.mysabri.in/${product.category || "best-sellers"}` },
    { name: product.name, url: `https://www.mysabri.in/${product.category || "best-sellers"}/${product.slug || product._id}` }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Schemas */}
      <ProductSchema product={product} />
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      {/* Header */}
      <div className="bg-neutral-50 py-6 sm:py-8 pt-28 sm:pt-40">
        <div className="container mx-auto px-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 mr-2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Cart
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-neutral-600 capitalize">
                {product.category.replace(/-/g, " ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image */}
          <div className="w-full">
            <div className="relative w-full aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-neutral-900">
                ₹{price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-neutral-500 line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {Math.round(
                      ((originalPrice - price) / originalPrice) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-neutral-700">{product.shortDescription}</p>
            )}

            {product.description && (
              <div
                className="prose max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Specs */}
            {product.specifications && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Specifications</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  {Object.entries(product.specifications)
                    .filter(([, v]) => !!v)
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-4">
                        <span className="capitalize text-neutral-500">
                          {k.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-neutral-900">{v}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/cart"
                className="px-5 py-3 rounded-md bg-neutral-900 text-white text-sm font-medium hover:opacity-90"
              >
                Back to Cart
              </Link>
              <Link
                href={`/${product.category ?? "best-sellers"}`}
                className="px-5 py-3 rounded-md border text-sm font-medium hover:bg-neutral-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Keep it empty to enable on-demand rendering
  return [];
}
