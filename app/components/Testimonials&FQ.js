"use client";
/* eslint react/no-unescaped-entities: "off" */

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FAQS = [
  {
    question: "What is included in a silver jewellery set?",
    answer:
      "A silver jewellery set often contains a matching necklace and earrings. Depending on the design and collection, certain sets may include a bracelet or ring as well.",
  },
  {
    question: "How do I know if my silver jewellery set is real 925 sterling silver?",
    answer:
      "Look for hallmarks like '925', 'Sterling', or 'S925' inscribed on the jewellery. Real silver jewellery sets are non-magnetic and develop a natural patina with time.",
  },
  {
    question: "Can I wear a silver jewellery set daily?",
    answer:
      "Yes, a 925 sterling silver jewellery set is suitable for everyday use. It is long-lasting, skin-friendly, and requires little maintenance beyond regular cleaning.",
  },
  {
    question: "What occasions are best for gifting a silver jewellery set?",
    answer:
      "Silver jewellery sets are ideal for birthdays, anniversaries, weddings, festivals, and milestone celebrations. They are timeless, meaningful, and suitable for women of all ages.",
  },
  {
    question:
      "How should I care for my silver jewellery set to maintain its shine?",
    answer:
      "To retain the brightness of your silver jewellery set, store it in an airtight box, avoid moisture and perfumes, and clean it regularly with a soft silver-polishing cloth.",
  },
  {
    question: "Is a silver jewellery set suitable for sensitive skin?",
    answer:
      "Yes, a 925 silver jewellery set is typically hypoallergenic and gentle on sensitive skin, making it ideal for daily or long-term usage.",
  },
  {
    question: "Does a silver jewellery set tarnish over time?",
    answer:
      "Real silver jewellery sets may tarnish slightly due to natural oxidation, but this is easily cleaned with a silver polishing cloth or a mild soap solution.",
  },
  {
    question: "Are silver jewellery sets good for bridal wear?",
    answer:
      "Absolutely. Many brides choose pure silver jewellery sets for their elegant shine, versatility in styling, and long-lasting appeal — especially for minimalist or modern bridal looks.",
  },
  {
    question: "Can I customise a silver jewellery set at Mysabri?",
    answer:
      "Yes, Mysabri may offer select customisation options depending on the design, such as chain length adjustments, pendant styles, and special gifting packaging.",
  },
  {
    question: "What makes a 925 silver jewellery set better than artificial jewellery?",
    answer:
      "A 925 silver jewellery set is more durable, skin-friendly, and long-lasting than artificial or plated jewellery. It retains its lustre longer and offers better value over time.",
  },
];

export default function MysabriJewellery() {
  const [showMore1, setShowMore1] = useState(false);
  const [showMore2, setShowMore2] = useState(false);
  const [showMore3, setShowMore3] = useState(false);
  const [showMore4, setShowMore4] = useState(false);
  const [showMore5, setShowMore5] = useState(false);
  const [showMore6, setShowMore6] = useState(false);
  const [showMore7, setShowMore7] = useState(false);
  const [showMore8, setShowMore8] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  return (
    <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-50/30 py-12 sm:py-20 lg:py-28 font-sans text-neutral-800">
      <div className="w-full px-4 sm:px-6 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide text-neutral-900 mb-4">
            silver jewellery set
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-100">
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
            A silver jewellery set is an ideal combination of elegance, flair, and eternal beauty. Whether you're preparing for a wedding, a party, or an everyday stylish appearance, a silver jewellery set always complements your inherent beauty. These jewellery sets, crafted from premium-quality 925 sterling silver, feature beautifully designed necklaces, earrings, bangles, bracelets, and pendants, making them suitable for every occasion. A well-made silver jewellery set not only complements your dress, but it also expresses your individuality and fashion sense.
          </p>
        </div>

        {/* Zig-zag Content Sections */}
        <div className="space-y-16 sm:space-y-24">
          
          {/* Section 1 - Content Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Stunning Silver Jewellery Set Designs for Every Special Occasion
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  When it comes to multipurpose accessories, a silver jewellery set is one
                  of the most classic options for women. Whether you're preparing for a
                  wedding, festival, corporate function, or a casual outing, a silver
                  jewellery set complements any ensemble.
                </p>
                {!showMore1 && (
                  <button
                    type="button"
                    onClick={() => setShowMore1(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore1 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      For special events like weddings, women love bold and ornate silver
                      jewellery sets with traditional themes and exquisite workmanship. On
                      the other hand, lightweight and simple styles are ideal for everyday
                      wear and workplace outfits, providing both comfort and refinement.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore1(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <Image 
                  src="/seo/s1.jpeg" 
                  alt="Elegant silver jewellery set for special occasions"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Section 2 - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                The Most Elegant Silver Jewellery Set Designs for All Events
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  A silver jewellery set is one of the most versatile accessories a woman
                  may have. Its natural sheen, lightweight feel, and timeless beauty make
                  it suitable for both everyday use and special events.
                </p>
                {!showMore2 && (
                  <button
                    type="button"
                    onClick={() => setShowMore2(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore2 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      Simple sterling silver pendants, basic earrings, and lightweight
                      silver sets look great with workplace attire, casual dresses, and
                      trendy ethnic wear. Silver jewellery glows even brighter when worn at
                      parties.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore2(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s3.jpeg" 
                  alt="Versatile silver jewellery for all events"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Section 3 - Content Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Trending Silver Jewellery Set Designs Every Woman Will Love
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  Choosing the right silver jewellery set depends on your personal style,
                  wardrobe choices, and the occasions you dress for. If you want a
                  minimalist and modern appearance, choose basic 925 silver jewellery sets.
                </p>
                {!showMore3 && (
                  <button
                    type="button"
                    onClick={() => setShowMore3(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore3 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      These designs go well with casual clothing, western dresses, and
                      office attire without being overly heavy or flashy. For those who
                      prefer classic or festive styles, consider oxidised silver jewellery
                      sets with elaborate patterns.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore3(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <Image 
                  src="/seo/s2.png" 
                  alt="Trending silver jewellery designs"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Section 4 - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Handpicked Silver Jewellery Set Designs for Every Moment
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  Wearing a 925 sterling silver jewellery set has several style and comfort
                  benefits, making it a popular choice for women of all ages. One of the
                  most significant advantages is durability.
                </p>
                {!showMore4 && (
                  <button
                    type="button"
                    onClick={() => setShowMore4(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore4 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      925 silver is crafted from 92.5% pure silver, making it sturdy enough for daily use while preserving
                      a lovely natural shine. It does not corrode or lose its shine easily.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore4(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s4.jpeg" 
                  alt="925 sterling silver jewellery benefits"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Section 5 - Content Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Elevate Your Look with Latest Silver Jewellery Set Designs
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  Knowing what to look for makes it simple to identify a genuine 925
                  silver jewellery set. Authentic pieces always have a "925" or "Sterling"
                  hallmark etched on the necklace clasp, earrings, or pendants.
                </p>
                {!showMore5 && (
                  <button
                    type="button"
                    onClick={() => setShowMore5(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore5 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      Real silver has a smooth, lustrous sheen and develops a natural
                      patina over time. You can also perform a magnet test — genuine 925 silver is not magnetic.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      To style your look even more beautifully, explore our elegant collection of 925 Silver Bracelets designed to pair perfectly with any <Link
                      href="https://www.mysabri.in/earrings"
                      className="text-amber-700 hover:text-amber-800 underline font-medium"
                    > silver earrings</Link>. Each bracelet is crafted from genuine 92.5 sterling silver.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore5(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s5.jpeg" 
                  alt="Authentic 925 silver hallmarks and quality"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Section 6 - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Finest Silver Jewellery Set Designs for Any Occasion
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  Finding the ideal silver jewellery set gift does not have to be
                  difficult — there are stunning options for every budget. Simple sterling silver pendant-and-earring
                  sets are an excellent choice for affordable elegance.
                </p>
                {!showMore6 && (
                  <button
                    type="button"
                    onClick={() => setShowMore6(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore6 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      At mid-range prices, designer 925 silver jewellery sets with sophisticated craftsmanship offer a luxurious look and feel. Premium pure silver sets are perfect for milestone events.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore6(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s6.jpeg" 
                  alt="Silver jewellery gift options for every budget"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Section 7 - Content Left, Image Right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Latest Silver Jewellery Set Designs for Timeless Elegance
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  Shop for your favourite silver jewellery set online at Mysabri and
                  experience a curated range of premium designs made from high-quality 925
                  sterling silver. Our sets start at just ₹1399.
                </p>
                {!showMore7 && (
                  <button
                    type="button"
                    onClick={() => setShowMore7(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore7 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      Each jewellery set is meticulously designed for durability, lustre,
                      and skin-friendly wear. Enjoy secure payments, fast shipping, and a reliable
                      online shopping experience.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore7(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s7.png" 
                  alt="Mysabri online silver jewellery collection"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Section 8 - Image Left, Content Right */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-4">
              <h2 className="text-xl sm:text-3xl font-serif font-normal text-neutral-900 mb-6">
                Premium Silver Jewellery Set Designs Perfect for Celebrations
              </h2>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-100/50">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 mb-4">
                  A premium silver jewellery set is more than just an accessory; it is a
                  timeless statement of beauty, grace, and refinement. Perfect for weddings, festivals, and special celebrations.
                </p>
                {!showMore8 && (
                  <button
                    type="button"
                    onClick={() => setShowMore8(true)}
                    className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                  >
                    Read more
                  </button>
                )}
                {showMore8 && (
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                      Crafted from high-quality 925 sterling silver, these sets strike the ideal balance between
                      luxury and everyday wearability. Latest collections feature oxidised silver sets and gemstone-studded designs.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMore8(false)}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
                    >
                      Read less
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100">
                <img 
                  src="/seo/s8.png" 
                  alt="Premium silver jewellery for celebrations"
                  width="400"
                  height="300"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

        </div>

        {/* FAQs Section */}
        <div className="mt-20 sm:mt-32">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 mb-4">
              FAQs – Silver Jewellery Set
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-amber-50/50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-neutral-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-lg leading-none text-amber-600 font-bold">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-neutral-700 bg-white/50 border-t border-amber-100/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
