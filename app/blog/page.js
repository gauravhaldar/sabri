"use client";
/* eslint react/no-unescaped-entities: "off" */

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Why 925 Sterling Silver Jewellery Is Best Choice for Daily & Festive Wear",
    excerpt: "Discover why modern women across India are choosing 925 sterling silver jewellery for work, college, and festive occasions – and how you can style it effortlessly for every day and celebrations.",
    image: "/bb.png",
    category: "Jewellery Guide",
    readTime: "8 min read",
    date: "Dec 15, 2024",
    slug: "why-925-sterling-silver-jewellery-is-best-choice"
  },
  {
    id: 2,
    title: "Silver Jewellery Trends for Brides & Bridesmaids: The Styles Every Girl Is Loving This Wedding Season",
    excerpt: "If you are a bride or bridesmaid trying to figure out which jewellery will actually make you feel confident, glowing, and truly 'you,' let me tell you something: you can never go wrong with SILVER JEWELLERY. It is classy, versatile, budget-friendly, and honestly, it looks good on every girl.",
    image: "/blog/blog222.png",
    category: "Wedding Trends",
    readTime: "10 min read",
    date: "Dec 10, 2024",
    slug: "silver-jewellery-trends-brides-bridesmaids"
  },
  {
    id: 3,
    title: "Top 10 Silver Necklace Designs Trending Right Now",
    excerpt: "Discover the top 10 silver necklace designs trending right now. From minimalist pendants to bold statement pieces, explore stylish 925 sterling silver necklaces for every occasion.",
    image: "/blog/blog3.png",
    category: "Trending Designs",
    readTime: "8 min read",
    date: "Dec 5, 2024",
    slug: "styling-silver-earrings-every-face-shape"
  }
];

// Full blog content component
function FullBlogPost({ post, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
            <div>
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">{post.category}</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900 mt-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {post.id === 1 && (
              <div className="space-y-6">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 mb-6">
                  <Image
                    src="/bb.png"
                    alt="925 sterling silver jewellery collection"
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <p>
                    Jewellery is an important aspect of personal style, and selecting the proper metal may make all the
                    difference. While gold and diamond jewellery have historically dominated the market, 925 sterling silver
                    jewellery has quickly become popular among modern ladies. 925 silver is beautiful, sturdy, inexpensive,
                    and extremely adaptable, making it ideal for both everyday use and exceptional celebratory events.
                  </p>
                  <p>
                    Whether you choose minimalist jewelry for everyday use or dazzling pieces for special occasions, 925
                    sterling silver finds the ideal mix between elegance and utility. Here's why it's the ideal pick for
                    both regular and holiday outfits.
                  </p>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">What is 925 Sterling Silver?</h2>
                <div className="space-y-4">
                  <p>
                    Sterling silver is an alloy composed of 92.5% pure silver and 7.5% additional reinforcing elements (often
                    copper). This combination boosts the jewellery's longevity without sacrificing its inherent brilliance.
                    The hallmark "925" indicates genuine sterling silver and ensures purity and long-lasting quality.
                  </p>
                  <p>
                    This combination makes 925 silver sturdy, elegant, and skin-friendly—ideal for ladies who desire
                    long-lasting jewelry.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
                    <Image
                      src="/bb1.png"
                      alt="Woman wearing silver jewellery daily"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
                    <Image
                      src="/bb2.png"
                      alt="Sterling silver jewellery styled for festive wear"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Perfect for Daily Wear—Durable and Long-Lasting</h2>
                <div className="space-y-4">
                  <p>
                    Many people think silver jewelry is fragile, yet 925 sterling silver is surprisingly resilient. The
                    additional alloy strengthens the metal, making it appropriate for daily usage.
                  </p>
                  <p className="font-medium">Why it's perfect for everyday wear:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                    <li>Does not shatter or bend easily.</li>
                    <li>Safe for every skin type, especially sensitive skin.</li>
                    <li>More resistant to scratches than pure silver.</li>
                    <li>Easy to maintain with simple cleaning.</li>
                  </ul>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Stunning Shine that Complements Festive Outfits</h2>
                <div className="space-y-4">
                  <p>
                    Diwali, Durga Puja, Eid, and Christmas all call for colorful, festive, and fashionable jewelry. 925 silver
                    jewellery has a stunning natural sheen that quickly boosts your holiday outfit.
                  </p>
                  <p className="font-medium">Silver works beautifully with:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base ml-4">
                    <li>Sarees</li>
                    <li>Lehengas</li>
                    <li>Kurtis</li>
                    <li>Western dresses</li>
                    <li>Indo-Western fusion clothing</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3"> Quick Tips</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>• Store in airtight pouches to prevent tarnishing</li>
                    <li>• Clean with silver polishing cloth regularly</li>
                    <li>• Avoid contact with perfumes and lotions</li>
                    <li>• Remove before swimming or bathing</li>
                  </ul>
                </div>
              </div>
            )}

            {post.id === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3"> Expert Care Guide</h3>
                  <p className="text-blue-800">Proper maintenance can extend the life of your silver rings by years. Follow our comprehensive care routine.</p>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Daily Care Routine</h2>
                <div className="space-y-4">
                  <p>Establish a simple daily routine to keep your silver rings looking their best.</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Morning Check:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Inspect for any damage or loose stones</li>
                      <li>• Clean with soft microfiber cloth</li>
                      <li>• Apply thin layer of silver polish if needed</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Weekly Deep Cleaning</h2>
                <div className="space-y-4">
                  <p>Once a week, give your silver rings extra attention with these steps:</p>
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>Prepare warm water with mild soap</li>
                    <li>Soak rings for 5-10 minutes</li>
                    <li>Gently scrub with soft toothbrush</li>
                    <li>Rinse thoroughly and dry completely</li>
                    <li>Apply silver polish for extra shine</li>
                  </ol>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Professional Maintenance</h2>
                <div className="space-y-4">
                  <p>Consider professional cleaning 2-3 times per year for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Deep cleaning of intricate designs</li>
                    <li>Stone setting inspection and tightening</li>
                    <li>Professional polishing and restoration</li>
                    <li>Rhodium plating for extra protection</li>
                  </ul>
                </div>
              </div>
            )}

            {post.id === 3 && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3"> Face Shape Guide</h3>
                  <p className="text-purple-800">Discover the most flattering silver earrings for your unique face shape with our expert styling guide.</p>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Round Face Shape</h2>
                <div className="space-y-4">
                  <p>For round faces, create angular lines to add definition and length.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium mb-2">Best Styles:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Dangle earrings</li>
                        <li>• Angular geometric shapes</li>
                        <li>• Long drop earrings</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium mb-2">Avoid:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Round hoops</li>
                        <li>• Button earrings</li>
                        <li>• Small studs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Oval Face Shape</h2>
                <div className="space-y-4">
                  <p>Oval faces are versatile and can pull off most earring styles. Focus on proportion and balance.</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-green-900">Perfect Choices:</h4>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>• Oval hoops</li>
                      <li>• Teardrop earrings</li>
                      <li>• Medium-sized studs</li>
                      <li>• Soft triangular shapes</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Square Face Shape</h2>
                <div className="space-y-4">
                  <p>Soften angular features with curved and rounded earring designs.</p>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-orange-900">Recommended:</h4>
                    <ul className="text-sm space-y-1 text-orange-800">
                      <li>• Round hoops</li>
                      <li>• Curved dangle earrings</li>
                      <li>• Oval-shaped drops</li>
                      <li>• Medium-sized circular designs</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Heart Face Shape</h2>
                <div className="space-y-4">
                  <p>Balance the wider forehead and narrower chin with strategic earring choices.</p>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-pink-900">Ideal Styles:</h4>
                    <ul className="text-sm space-y-1 text-pink-800">
                      <li>• Triangle-shaped earrings</li>
                      <li>• Narrow chandelier styles</li>
                      <li>• Teardrop with pointed bottom</li>
                      <li>• Medium-sized angular designs</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <Head>
        <title>Silver Jewellery Blog | Mysabri</title>
        <meta
          name="description"
          content="Discover expert tips, styling guides, and care advice for silver jewellery. Learn about 925 sterling silver, ring maintenance, earring styling, and more."
        />
      </Head>

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 bg-white text-neutral-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-neutral-900 mb-4">
              Silver Jewellery Blog
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              Expert tips, styling guides, and care advice for your precious silver jewellery collection
            </p>
          </header>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-amber-300 hover:scale-[1.02]"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-lg sm:text-xl font-serif font-semibold text-neutral-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors">
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Blog Post Modal */}
      {selectedPost && (
        <FullBlogPost 
          post={selectedPost} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
