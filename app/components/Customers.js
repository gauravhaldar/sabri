"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Customers() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/reviews?status=approved&limit=9`, {
          next: { revalidate: 60 },
        });
        const data = await res.json();
        if (data?.success && Array.isArray(data?.data?.reviews)) {
          if (mounted) setReviews(data.data.reviews);
        }
      } catch (_) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-8 sm:mb-10 text-gray-800">
        Trusted by our community
      </h2>

      <div className="relative max-w-6xl mx-auto flex items-center justify-center">
        {/* Left Button */}
        <button
          onClick={prev}
          className="hidden sm:inline-flex absolute left-0 bg-black text-white p-2 sm:p-3 rounded-full hover:bg-gray-800"
        >
          <ChevronLeft size={20} className="sm:hidden" />
          <ChevronLeft size={22} className="hidden sm:block" />
        </button>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {!loading && reviews.length === 0 && (
            <div className="col-span-full text-gray-500">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: i === index ? 1 : 0.5, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`p-5 sm:p-6 rounded-2xl shadow-sm bg-white border ${
                i === index
                  ? "scale-[1.02] sm:scale-105"
                  : "opacity-80 sm:opacity-70"
              }`}
            >
              <div className="flex justify-center mb-2">
                {"⭐".repeat(review.rating || 0)}
              </div>
              <p className="font-medium text-gray-800">{review.userName}</p>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {review.text}
              </p>

              {(review.productImage || review.productName) && (
                <div className="mt-4 flex items-center justify-center bg-gray-100 rounded-lg p-3">
                  {review.productImage && (
                    <Image
                      src={review.productImage}
                      alt={review.productName || "Product"}
                      width={64}
                      height={64}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
                    />
                  )}
                  {review.productName && (
                    <span className="ml-3 text-sm font-medium text-gray-800">
                      {review.productName}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={next}
          className="hidden sm:inline-flex absolute right-0 bg-black text-white p-2 sm:p-3 rounded-full hover:bg-gray-800"
        >
          <ChevronRight size={20} className="sm:hidden" />
          <ChevronRight size={22} className="hidden sm:block" />
        </button>
      </div>

      {/* <div className="mt-8 sm:mt-10">
        <button className="border border-black px-5 sm:px-6 py-2 text-xs sm:text-sm uppercase tracking-wider hover:bg-black hover:text-white transition">
          View All Reviews
        </button>
      </div> */}
    </section>
  );
}
