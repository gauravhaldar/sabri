"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const TABS = [
  { key: "all", label: "ALL" },
  { key: "necklaces", label: "NECKLACES" },
  { key: "bracelets", label: "BRACELETS" },
  { key: "earrings", label: "EARRINGS" },
  { key: "rings", label: "RINGS" },
  { key: "mens", label: "MENS" },
  { key: "mangalsutra", label: "MANGALSUTRA" },
];

const MOCK_PRODUCTS = [
  {
    id: "p1",
    title: "Hearts All Over Bracelet",
    price: 2229,
    original: 3184,
    discountPct: 30,
    category: "bracelets",
    image: "/topsale/bl.webp",
    badge: "BUY 1 GET 1",
  },
  {
    id: "p2",
    title: "Crystal Love Bangle Bracelet",
    price: 2346,
    original: 3799,
    discountPct: 38,
    category: "bracelets",
    image: "/topsale/bl2.webp",
    badge: "BUY 1 GET 1",
  },
  {
    id: "p3",
    title: "Athena Solitaire Hoop Earrings",
    price: 2258,
    original: 3226,
    discountPct: 30,
    category: "earrings",
    image: "/topsale/bl3.webp",
    badge: "BUY 1 GET 1",
  },
  {
    id: "p4",
    title: "Nail Bangle Bracelet",
    price: 2258,
    original: 3226,
    discountPct: 30,
    category: "bracelets",
    image: "/topsale/ear.webp",
    badge: "BUY 1 GET 1",
  },
];

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export default function TopSales({ products = MOCK_PRODUCTS }) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[16px] sm:text-[20px] md:text-[22px] tracking-wide uppercase py-4 sm:py-6">
          PALMONAS TOP STYLES
        </h2>

        {/* Tabs */}
        <div className="flex items-center justify-start gap-2 sm:gap-4 pb-4 sm:pb-6 overflow-x-auto no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-shrink-0 rounded px-3 sm:px-4 py-2 text-[11px] sm:text-sm tracking-wide border transition-colors ${
                active === t.key
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((p) => (
            <article key={p.id} className="group border border-neutral-200">
              <div className="relative aspect-[4/5] overflow-hidden">
                {p.badge && (
                  <span className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 rounded bg-white/90 px-2 py-1 text-[10px] sm:text-[11px] font-medium tracking-wide">
                    {p.badge}
                  </span>
                )}
                <button className="absolute left-2 bottom-2 sm:left-3 sm:bottom-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-neutral-700">
                  {/* heart icon */}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:1024px) 50vw, 25vw"
                />
                <div className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 z-10">
                  <button className="rounded bg-neutral-900 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white shadow-sm hover:opacity-90 shake-attention">
                    ADD TO BAG
                  </button>
                </div>
              </div>
              <div className="px-3 py-3">
                <h3 className="line-clamp-1 text-[13px] sm:text-sm text-neutral-900">
                  {p.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-[13px]">
                  <span className="font-medium text-neutral-900">
                    {formatINR(p.price)}
                  </span>
                  <span className="text-neutral-500 line-through">
                    {formatINR(p.original)}
                  </span>
                  <span className="text-emerald-600">({p.discountPct}%)</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
