"use client";

import Image from "next/image";
import Link from "next/link";

export default function GiftSection({
  title = "THE GIFTING EDIT",
  cards = [
    { label: "", target: "", image: "/gift/gf.webp", route: "/earrings" },
    { label: "", target: "", image: "/gift/bf.webp", route: "/mens" },
    {
      label: "",
      target: "",
      image: "/gift/wife.webp",
      route: "/necklaces",
    },
    {
      label: "",
      target: "",
      image: "/gift/husband.webp",
      route: "/rings",
    },
  ],
}) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[16px] sm:text-[20px] md:text-[22px] tracking-wide uppercase py-4 sm:py-6">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((c, idx) => (
            <Link
              key={`${c.target}-${idx}`}
              href={c.route || "#"}
              className="group relative block focus:outline-none focus:ring-2 focus:ring-neutral-900/20 rounded"
            >
              <article className="group relative transition-transform duration-300 hover:scale-105">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={`${c.label} ${c.target}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width:1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-5">
                  <p className="text-center text-xs sm:text-sm text-neutral-700 tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-center mt-1 text-xl sm:text-3xl font-serif tracking-wide text-white drop-shadow-lg">
                    {c.target}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
