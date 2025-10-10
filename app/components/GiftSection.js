"use client";

import Image from "next/image";

export default function GiftSection({
  title = "THE GIFTING EDIT",
  cards = [
    { label: "", target: "", image: "/gift/gf.webp" },
    { label: "", target: "", image: "/gift/bf.webp" },
    { label: "", target: "", image: "/gift/wife.webp" },
    { label: "", target: "", image: "/gift/husband.webp" },
  ],
}) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-0 sm:px-1 lg:px-2">
        <h2 className="text-center text-[18px] sm:text-[20px] md:text-[22px] tracking-wide uppercase py-6">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => (
            <article key={`${c.target}-${idx}`} className="group relative ">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={c.image} alt={`${c.label} ${c.target}`} fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/0" />
              </div>
              <div className="absolute left-4 right-4 bottom-5">
                <p className="text-center text-sm text-neutral-700 tracking-wide">{c.label}</p>
                <p className="text-center mt-1 text-2xl sm:text-3xl font-serif tracking-wide">{c.target}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


