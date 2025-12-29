"use client";

import Link from "next/link";
import Image from "next/image";

export default function Category({
  title = "EVERYDAY SILVER JEWELLERY",
  items = [
    {
      title: "Rings",
      imageSrc: "/every/ring.png",
      href: "/rings",
    },
    {
      title: "Earrings",
      imageSrc: "/every/earring.png",
      href: "/earrings",
    },
    {
      title: "Necklaces",
      imageSrc: "/every/neck.png",
      href: "/necklaces",
    },
    {
      title: "Bracelets",
      imageSrc: "/every/bracelet.png",
      href: "/bracelets",
    },
    {
      title: "Gifts",
      imageSrc: "/every/gifts.png",
      href: "/gifts",
    },
    {
      title: "Men's",
      imageSrc: "/every/men.png",
      href: "/mens",
    },
  ],
}) {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-center text-[18px] sm:text-[20px] md:text-[22px] tracking-wide uppercase py-6">
          {title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {items.map((item, idx) => (
            <Link
              href={item.href || "#"}
              key={`${item.title}-${idx}`}
              className="group relative isolate aspect-[3/4] overflow-hidden rounded-lg"
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
              <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-wide text-neutral-100">
                <span className="px-1 py-0.5">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
