"use client";

import Image from "next/image";
import Link from "next/link";

export default function GiftSection({
  title = "JEWELLERY FOR EVERY RELATIONSHIP",
  cards = [
    { label: "For Her", target: "Women's Collection", image: "/gift/women.png", route: "/women" },
    { label: "For Him", target: "Men's Collection", image: "/gift/men.png", route: "/mens" },
  ],
}) {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <Image
            src="/headings/jewellery for every frelationship.png"
            alt="JEWELLERY FOR EVERY RELATIONSHIP"
            width={400}
            height={60}
            className="h-auto w-full max-w-lg object-contain"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
          {cards.map((c, idx) => (
            <Link
              key={`${c.target}-${idx}`}
              href={c.route || "#"}
              className="group relative block focus:outline-none focus:ring-4 focus:ring-amber-500/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              <article className="relative">
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={`${c.label} - ${c.target}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6 lg:p-8">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm lg:text-base text-amber-200 font-medium tracking-wider uppercase">
                      {c.label}
                    </p>
                    <h3 className="text-sm sm:text-xl lg:text-3xl font-serif text-white font-bold tracking-wide drop-shadow-2xl">
                      {c.target}
                    </h3>
                    <div className="mt-2 sm:mt-4 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                        Shop Now
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
