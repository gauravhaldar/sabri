"use client";
/* eslint react/no-unescaped-entities: "off" */

import React, { useState } from "react";
import Link from "next/link";

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
    <section className="w-full bg-white py-12 sm:py-20 lg:py-28 font-sans text-neutral-800">
      <div className="w-full px-4 sm:px-6 lg:px-16">
        {/* Heading */}
        <h1 className="text-left text-2xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide mb-6 sm:mb-8 text-neutral-900">
          silver jewellery set
        </h1>

        <div className="space-y-8 sm:space-y-10 text-neutral-700 text-[14px] sm:text-base leading-relaxed">
          {/* Intro */}
          <p>
            A silver jewellery set is an ideal combination of elegance, flair, and
            eternal beauty. Whether you're preparing for a wedding, a party, or an
            everyday stylish appearance, a silver jewellery set always complements
            your inherent beauty. These jewellery sets, made of premium-quality 925
            sterling silver, include wonderfully designed necklaces, earrings,
            bangles, bracelets, and pendants, making them suitable for every
            occasion.A well-made silver jewellery set not only complements your dress, but it
            also expresses your individuality and fashion sense. Silver's sheen,
            durability, and affordability make it a popular option among modern women
            who want minimalist yet exquisite accessories. From classic handcrafted
            pieces to fashionable modern designs, silver jewellery sets provide
            limitless ways to show your personality.Whether you desire a basic and elegant appearance or a bold and
            fashionable statement, the perfect silver jewellery set can easily
            complete your style and set you apart. Silver jewellery remains a
            favourite accessory for people of all ages, making it ideal for gifting,
            special occasions, and everyday use.
          </p>

          {/* 1. Stunning Silver Jewellery Set Designs for Every Special Occasion */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Stunning Silver Jewellery Set Designs for Every Special Occasion
          </h2>
          <p>
            When it comes to multipurpose accessories, a silver jewellery set is one
            of the most classic options for women. Whether you're preparing for a
            wedding, festival, corporate function, or a casual outing, a silver
            jewellery set complements any ensemble.
            Modern trends include minimalist silver pendant sets, oxidised silver
            choker sets, Kundan-inspired silver jewellery, and 925 sterling silver
            necklace-and-earring sets, each with a distinct combination of style and
            elegance.
            {!showMore1 && (
              <button
                type="button"
                onClick={() => setShowMore1(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore1 && (
            <>
              <p>
                For special events like weddings, women love bold and ornate silver
                jewellery sets with traditional themes and exquisite workmanship. On
                the other hand, lightweight and simple styles are ideal for everyday
                wear and workplace outfits, providing both comfort and refinement.
              </p>
              <p>
                Contemporary designs now use silver, pearls, gemstones, and
                sophisticated geometric patterns to fit any personality. If you're
                searching for a collection that can be worn for every occasion, from
                parties to everyday dressing, Mysabri has beautifully crafted silver
                jewellery sets that will instantly enhance your fashion game.
              </p>
              <button
                type="button"
                onClick={() => setShowMore1(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 2. The Most Elegant Silver Jewellery Set Designs for All Events */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            The Most Elegant Silver Jewellery Set Designs for All Events
          </h2>
          <p>
            A silver jewellery set is one of the most versatile accessories a woman
            may have. Its natural sheen, lightweight feel, and timeless beauty make
            it suitable for both everyday use and special events. Silver jewellery
            sets are ideal for everyday use since they provide a delicate appeal
            without being heavy or overbearing.
            {!showMore2 && (
              <button
                type="button"
                onClick={() => setShowMore2(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore2 && (
            <>
              <p>
                Simple sterling silver pendants, basic earrings, and lightweight
                silver sets look great with workplace attire, casual dresses, and
                trendy ethnic wear. Silver jewellery glows even brighter when worn at
                parties. Intricate designs, oxidised workmanship, and
                gemstone-enhanced silver settings give a striking and spectacular
                appearance.
              </p>
              <p>
                Whether it's a wedding, festival, or cocktail party, a finely carved
                925 silver jewellery set instantly enhances your overall appearance
                and complements any attire. Silver looks well on all skin tones and
                complements practically every colour, making it a popular option among
                modern women. With options ranging from contemporary to classic,
                silver jewellery sets provide the perfect blend of elegance, comfort,
                and style for both everyday wear and celebrations.
              </p>
              <button
                type="button"
                onClick={() => setShowMore2(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 3. Trending Silver Jewellery Set Designs Every Woman Will Love */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Trending Silver Jewellery Set Designs Every Woman Will Love
          </h2>
          <p>
            Choosing the right silver jewellery set depends on your personal style,
            wardrobe choices, and the occasions you dress for. If you want a
            minimalist and modern appearance, choose basic 925 silver jewellery sets
            with clean lines, modest pendants, and lightweight earrings.
            {!showMore3 && (
              <button
                type="button"
                onClick={() => setShowMore3(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore3 && (
            <>
              <p>
                These designs go well with casual clothing, western dresses, and
                office attire without being overly heavy or flashy. For those who
                prefer classic or festive styles, consider oxidised silver jewellery
                sets, elaborate patterns, or gemstone-adorned pieces. These sets
                complement ethnic ensembles such as sarees, lehengas, and kurtis,
                giving you a bold and sophisticated look.
              </p>
              <p>
                Your skin tone and face shape also influence the best choice. Long,
                sleek necklaces suit round faces, while heart-shaped or oval faces
                look wonderful with choker-style silver sets. If you often attend
                parties or festivities, investing in a high-quality pure silver
                jewellery set guarantees durability, brightness, and long-term value.
                Whether you choose traditional, modern, or festive designs, the right
                silver jewellery set ensures you always appear elegant and
                confident.
              </p>
              <button
                type="button"
                onClick={() => setShowMore3(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 4. Handpicked Silver Jewellery Set Designs for Every Moment That Matters */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Handpicked Silver Jewellery Set Designs for Every Moment That Matters
          </h2>
          <p>
            Wearing a 925 sterling silver jewellery set has several style and comfort
            benefits, making it a popular choice for women of all ages. One of the
            most significant advantages is durability — 925 silver is crafted from
            92.5% pure silver, making it sturdy enough for daily use while preserving
            a lovely natural shine.
            {!showMore4 && (
              <button
                type="button"
                onClick={() => setShowMore4(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore4 && (
            <>
              <p>
                It does not corrode or lose its shine easily, so your favourite sets
                will remain beautiful for years. Another advantage is skin
                friendliness. 925 sterling silver jewellery sets are hypoallergenic,
                making them suitable for sensitive skin and long periods of wear.
              </p>
              <p>
                Their lightweight feel provides comfort whether you're dressed for
                work, a casual outing, or a celebratory occasion. A 925 silver
                jewellery set also offers exceptional versatility. It pairs well with
                western outfits, ethnic attire, and party dresses, making it a
                must-have in any wardrobe. If you value elegance, comfort, and
                long-term value, a 925 sterling silver jewellery set is the perfect
                companion for everyday sophistication.
              </p>
              <button
                type="button"
                onClick={() => setShowMore4(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 5. Elevate Your Look with the Latest Silver Jewellery Set Designs */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Elevate Your Look with the Latest Silver Jewellery Set Designs
          </h2>
          <p>
            Knowing what to look for makes it simple to identify a genuine 925
            silver jewellery set. Authentic pieces always have a "925" or "Sterling"
            hallmark, which is commonly etched on the necklace clasp, earrings, or
            pendants. This symbol indicates that the jewellery contains 92.5% pure
            silver.
            {!showMore5 && (
              <button
                type="button"
                onClick={() => setShowMore5(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore5 && (
            <>
              <p>
                Real silver has a smooth, lustrous sheen and develops a natural
                patina over time, as opposed to fake metals, which appear too glossy
                or dull. The magnet test is another way to determine authenticity;
                genuine 925 silver is not magnetic and should not stick to a magnet.
              </p>
              <p>
                You may also perform a soft cloth rub test — real silver leaves a
                slight black mark due to natural oxidation. Purchasing from reputable
                retailers such as Mysabri ensures that your silver jewellery set is
                certified, high-quality, and made from genuine sterling silver.
              </p>
              <p>
                To style your look even more beautifully, explore our elegant collection of 925 Silver Bracelets designed to pair perfectly with any <Link
              href="https://www.mysabri.in/earrings"
              className="hover:underline"
            > silver earrings</Link> Each bracelet is crafted from genuine 92.5 sterling silver, offering the same shine, purity, and long-lasting durability as our earrings. Match your favourite earrings with a stylish bracelet to create a complete and sophisticated silver jewellery set.
              </p>
              <button
                type="button"
                onClick={() => setShowMore5(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 6. Explore the Finest Silver Jewellery Set Designs for Any Occasion */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Explore the Finest Silver Jewellery Set Designs for Any Occasion
          </h2>
          <p>
            Finding the ideal silver jewellery set gift does not have to be
            difficult — there are stunning options for every budget. For an
            affordable yet elegant gift, simple sterling silver pendant-and-earring
            sets are an excellent choice.
            {!showMore6 && (
              <button
                type="button"
                onClick={() => setShowMore6(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore6 && (
            <>
              <p>
                These lightweight designs provide beauty and brilliance at an
                accessible price point, making them perfect for birthdays,
                anniversaries, or thoughtful everyday gifting. At mid-range prices,
                designer 925 silver jewellery sets with sophisticated craftsmanship,
                gemstone embellishments, or fashionable motifs offer a luxurious look
                and feel.
              </p>
              <p>
                These sets are ideal for special occasions such as weddings,
                festivals, and formal celebrations. Premium pure silver jewellery sets
                with handcrafted detailing are the finest option for someone who loves
                statement jewellery. They exude refinement and timeless beauty,
                making them perfect for milestone events. A silver jewellery set,
                regardless of budget, is always a meaningful, long-lasting gift that
                blends style, tradition, and elegance.
              </p>
              <button
                type="button"
                onClick={() => setShowMore6(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 7. Unveiling the Latest Silver Jewellery Set Designs for Timeless Elegance */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Unveiling the Latest Silver Jewellery Set Designs for Timeless Elegance
          </h2>
          <p>
            Shop for your favourite silver jewellery set online at Mysabri and
            experience a curated range of premium designs made from high-quality 925
            sterling silver. Whether you want an elegant pure silver jewellery set, a
            fashionable oxidised set, or a traditional silver
            necklace-and-earring combination, Mysabri has something for you.
            {!showMore7 && (
              <button
                type="button"
                onClick={() => setShowMore7(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore7 && (
            <>
              <p>
                Each jewellery set is meticulously designed for durability, lustre,
                and skin-friendly wear — ideal for everyday use or special events.
                Our sets start at just ₹1399, making luxury accessible without
                compromising on quality.
              </p>
              <p>
                You can shop for a 925 silver jewellery set from Mysabri with
                confidence thanks to secure payments, fast shipping, and a reliable
                online shopping experience. Discover our unique designs, on-trend
                themes, and timeless classics — all in one place.
              </p>
              <button
                type="button"
                onClick={() => setShowMore7(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* 8. Premium Silver Jewellery Set Designs Perfect for Every Celebration */}
          <h2 className="text-xl sm:text-3xl font-serif font-normal mt-10 sm:mt-12 text-neutral-900">
            Premium Silver Jewellery Set Designs Perfect for Every Celebration
          </h2>
          <p>
            A premium silver jewellery set is more than just an accessory; it is a
            timeless statement of beauty, grace, and refinement. Whether you're
            preparing for a wedding, festival, anniversary, party, or a casual family
            gathering, the right silver jewellery set can instantly elevate your
            entire look.
            {!showMore8 && (
              <button
                type="button"
                onClick={() => setShowMore8(true)}
                className="ml-1 text-sm font-medium text-neutral-900 underline inline"
              >
                Read more
              </button>
            )}
          </p>
          {showMore8 && (
            <>
              <p>
                These sets, designed with delicate craftsmanship and crafted from
                high-quality 925 sterling silver, strike the ideal balance between
                luxury and everyday wearability. Premium silver jewellery sets are
                loved by modern women because they pair beautifully with everything
                from traditional sarees and lehengas to western gowns and casual
                outfits.
              </p>
              <p>
                The latest collections feature oxidised silver sets, minimalist
                pendant-and-earring combinations, gemstone-studded silver necklaces,
                and intricately carved choker sets. Whether you choose delicate
                designs for office wear or bold statement pieces for grand events, a
                fine silver jewellery set brings unmatched elegance to every
                celebration and remains a treasured part of your collection.
              </p>
              <button
                type="button"
                onClick={() => setShowMore8(false)}
                className="text-sm font-medium text-neutral-900 underline"
              >
                Read less
              </button>
            </>
          )}

          {/* FAQs */}
          <h2 className="text-2xl sm:text-3xl font-serif font-normal mt-12 sm:mt-16 mb-4 sm:mb-6 text-left text-neutral-900">
            FAQs – Silver Jewellery Set
          </h2>

          <div className="space-y-3 sm:space-y-4 mt-2">
            {FAQS.map((faq, index) => (
              <div
                key={faq.question}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-semibold text-sm sm:text-base text-neutral-900">
                    {faq.question}
                  </span>
                  <span className="ml-2 text-lg leading-none text-gray-600">
                    {openFaqIndex === index ? "-" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-3 py-2 text-xs sm:text-sm text-neutral-700 bg-white">
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
