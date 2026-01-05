import { notFound } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Blog posts data (same as in main blog page)
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
    excerpt: "If you are a bride or bridesmaid trying to figure out which jewellery will actually make you feel confident, glowing, and truly &apos;you,&apos; let me tell you something: you can never go wrong with SILVER JEWELLERY. It is classy, versatile, budget-friendly, and honestly, it looks good on every girl.",
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

// Blog content components
function BlogPostContent({ post }) {
  return (
    <div className="space-y-8">
      {post.id === 1 && (
        <>
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src="/bb.png"
              alt="925 sterling silver jewellery collection"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <p>
              Jewellery is an important aspect of personal style, and selecting the proper metal may make all the
              difference. While gold and diamond jewellery have historically dominated the market, 925 sterling silver
              jewellery has quickly become popular among modern ladies. 925 silver is beautiful, sturdy, inexpensive,
              and extremely adaptable, making it ideal for both everyday use and exceptional celebratory events.
            </p>
            <p>
              Whether you choose minimalist jewelry for everyday use or dazzling pieces for special occasions, 925
              sterling silver finds the ideal mix between elegance and utility. Here&apos;s why it&apos;s the ideal pick for
              both regular and holiday outfits.
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">What is 925 Sterling Silver?</h2>
          <div className="space-y-4">
            <p>
              Sterling silver is an alloy composed of 92.5% pure silver and 7.5% additional reinforcing elements (often
              copper). This combination boosts the jewellery&apos;s longevity without sacrificing its inherent brilliance.
              The hallmark &quot;925&quot; indicates genuine sterling silver and ensures purity and long-lasting quality.
            </p>
            <p>
              This combination makes 925 silver sturdy, elegant, and skin-friendly—ideal for ladies who desire
              long-lasting jewelry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
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

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Perfect for Daily Wear—Durable and Long-Lasting</h2>
          <div className="space-y-4">
            <p>
              Many people think silver jewelry is fragile, yet 925 sterling silver is surprisingly resilient. The
              additional alloy strengthens the metal, making it appropriate for daily usage.
            </p>
            <p className="font-medium text-lg">Why it&apos;s perfect for everyday wear:</p>
            <ul className="list-disc list-inside space-y-3 text-base ml-6">
              <li>Does not shatter or bend easily.</li>
              <li>Safe for every skin type, especially sensitive skin.</li>
              <li>More resistant to scratches than pure silver.</li>
              <li>Easy to maintain with simple cleaning.</li>
            </ul>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Stunning Shine that Complements Festive Outfits</h2>
          <div className="space-y-4">
            <p>
              Diwali, Durga Puja, Eid, and Christmas all call for colorful, festive, and fashionable jewelry. 925 silver
              jewellery has a stunning natural sheen that quickly boosts your holiday outfit.
            </p>
            <p className="font-medium text-lg">Silver works beautifully with:</p>
            <ul className="list-disc list-inside space-y-3 text-base ml-6">
              <li>Sarees</li>
              <li>Lehengas</li>
              <li>Kurtis</li>
              <li>Western dresses</li>
              <li>Indo-Western fusion clothing</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 my-8">
            <h3 className="text-xl font-semibold text-amber-900 mb-4"> Quick Tips</h3>
            <ul className="space-y-3 text-base text-amber-800">
              <li>• Store in airtight pouches to prevent tarnishing</li>
              <li>• Clean with silver polishing cloth regularly</li>
              <li>• Avoid contact with perfumes and lotions</li>
              <li>• Remove before swimming or bathing</li>
            </ul>
          </div>
        </>
      )}

      {post.id === 2 && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4"> Expert Care Guide</h3>
            <p className="text-blue-800 text-lg">Proper maintenance can extend the life of your silver rings by years. Follow our comprehensive care routine.</p>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Daily Care Routine</h2>
          <div className="space-y-4">
            <p className="text-lg">Establish a simple daily routine to keep your silver rings looking their best.</p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-lg mb-3">Morning Check:</h4>
              <ul className="space-y-2 text-base">
                <li>• Inspect for any damage or loose stones</li>
                <li>• Clean with soft microfiber cloth</li>
                <li>• Apply thin layer of silver polish if needed</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Weekly Deep Cleaning</h2>
          <div className="space-y-4">
            <p className="text-lg">Once a week, give your silver rings extra attention with these steps:</p>
            <ol className="list-decimal list-inside space-y-3 ml-6 text-base">
              <li>Prepare warm water with mild soap</li>
              <li>Soak rings for 5-10 minutes</li>
              <li>Gently scrub with soft toothbrush</li>
              <li>Rinse thoroughly and dry completely</li>
              <li>Apply silver polish for extra shine</li>
            </ol>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Professional Maintenance</h2>
          <div className="space-y-4">
            <p className="text-lg">Consider professional cleaning 2-3 times per year for:</p>
            <ul className="list-disc list-inside space-y-3 ml-6 text-base">
              <li>Deep cleaning of intricate designs</li>
              <li>Stone setting inspection and tightening</li>
              <li>Professional polishing and restoration</li>
              <li>Rhodium plating for extra protection</li>
            </ul>
          </div>
        </>
      )}

      {post.id === 3 && (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-purple-900 mb-4"> Face Shape Guide</h3>
            <p className="text-purple-800 text-lg">Discover the most flattering silver earrings for your unique face shape with our expert styling guide.</p>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Round Face Shape</h2>
          <div className="space-y-4">
            <p className="text-lg">For round faces, create angular lines to add definition and length.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-medium text-lg mb-3">Best Styles:</h4>
                <ul className="space-y-2 text-base">
                  <li>• Dangle earrings</li>
                  <li>• Angular geometric shapes</li>
                  <li>• Long drop earrings</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-medium text-lg mb-3">Avoid:</h4>
                <ul className="space-y-2 text-base">
                  <li>• Round hoops</li>
                  <li>• Button earrings</li>
                  <li>• Small studs</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Oval Face Shape</h2>
          <div className="space-y-4">
            <p className="text-lg">Oval faces are versatile and can pull off most earring styles. Focus on proportion and balance.</p>
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-medium text-lg mb-3 text-green-900">Perfect Choices:</h4>
              <ul className="space-y-2 text-base text-green-800">
                <li>• Oval hoops</li>
                <li>• Teardrop earrings</li>
                <li>• Medium-sized studs</li>
                <li>• Soft triangular shapes</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Square Face Shape</h2>
          <div className="space-y-4">
            <p className="text-lg">Soften angular features with curved and rounded earring designs.</p>
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-medium text-lg mb-3 text-orange-900">Recommended:</h4>
              <ul className="space-y-2 text-base text-orange-800">
                <li>• Round hoops</li>
                <li>• Curved dangle earrings</li>
                <li>• Oval-shaped drops</li>
                <li>• Medium-sized circular designs</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900">Heart Face Shape</h2>
          <div className="space-y-4">
            <p className="text-lg">Balance the wider forehead and narrower chin with strategic earring choices.</p>
            <div className="bg-pink-50 rounded-lg p-6">
              <h4 className="font-medium text-lg mb-3 text-pink-900">Ideal Styles:</h4>
              <ul className="space-y-2 text-base text-pink-800">
                <li>• Triangle-shaped earrings</li>
                <li>• Narrow chandelier styles</li>
                <li>• Teardrop with pointed bottom</li>
                <li>• Medium-sized angular designs</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  // Find the blog post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // If no post found, return 404
  if (!post) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{post.title} | Mysabri Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
      </Head>

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 bg-white text-neutral-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </nav>

          {/* Blog Banner */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-100 to-orange-100 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-4xl mx-auto">
                <span className="bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-full inline-block mb-4">
                  {post.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <article>
            <div className="prose prose-lg max-w-none">
              <BlogPostContent post={post} />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Share this article</h3>
                  <div className="flex gap-3">
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <Link 
                  href="/blog"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Read More Articles
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
