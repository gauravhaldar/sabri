"use client";

import Link from "next/link";
import Image from "next/image";

export default function Category({
  title = "EVERYDAY DEMIFINE JEWELLERY",
  items = [
    {
      title: "",
      imageSrc: "/category/ring.webp",
      href: "/best-sellers",
    },
    {
      title: "",
      imageSrc: "/category/earring.webp",
      href: "/fine-silver",
    },
    {
      title: "",
      imageSrc: "/category/neck.webp",
      href: "/necklaces",
    },
    {
      title: "",
      imageSrc: "/category/bracelet.webp",
      href: "/earrings",
    },
    {
      title: "",
      imageSrc: "/category/mangal.webp",
      href: "/fine-gold",
    },
    {
      title: "",
      imageSrc: "/category/men.webp",
      href: "/mens",
    },
  ],
}) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-0 sm:px-1 lg:px-2">
        {/* Heading */}
        <h2 className="text-center text-[18px] sm:text-[20px] md:text-[22px] tracking-wide uppercase py-6">
          {title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 border border-neutral-200">
          {items.map((item, idx) => (
            <Link
              href={item.href || "#"}
              key={`${item.title}-${idx}`}
              className="group relative isolate aspect-[3/4] overflow-hidden border-r border-b border-neutral-200 last:border-r-0"
            >
              {/* Image */}
              <div className="absolute inset-0">
                {/* Use Next Image when real assets are available; temporary fallback to background color */}
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 16.6vw"
                />
              </div>

              {/* Label */}
              <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-wide text-neutral-900">
                <span className="px-1 py-0.5">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
