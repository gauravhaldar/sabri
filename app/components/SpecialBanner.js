"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Full-width special banner with title, autoplay, and click-to-pause functionality
export default function SpecialBanner({
  title = "GIFTING SPECIAL",
  slides = [
    { image: "/specialbanner/5.png", caption: "", sub: " ", cta: "SHOP NOW", link: "/gifts" },
    { image: "/specialbanner/3.png", caption: "", sub: " ", cta: "SHOP NOW", link: "/new-arrivals" },
    { image: "/specialbanner/6.png", caption: "", sub: " ", cta: "SHOP NOW", link: "/rings" },
    { image: "/specialbanner/4.png", caption: "", sub: "", cta: "SHOP NOW", link: "/best-sellers" },
  ],
  autoplayMs = 5000, // Slowed down from 2000ms to 5000ms
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused || !autoplayMs) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, autoplayMs);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [index, paused, autoplayMs, slides.length]);

  const toggle = () => setPaused((p) => !p);

  return (
    <section className="w-full bg-black">
      <div className="mx-auto max-w-[1920px]">
        {/* Banner */}
        <div
          className="relative w-full cursor-pointer"
        >
          <div className="relative w-full" style={{ paddingBottom: '40%' }}>
            {slides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === index ? 1 : 0 }}
              >
                <Image
                  src={s.image}
                  alt={s.caption || "banner"}
                  fill
                  className="object-cover"
                  priority={i === index}
                  onClick={toggle}
                />

                {/* Shop Now Button - Always visible */}
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10">
                  <Link
                    href={s.link || "/best-sellers"}
                    className="inline-flex items-center gap-1 sm:gap-2 border border-black bg-transparent text-black px-3 py-1.5 sm:px-6 sm:py-2.5 rounded text-xs sm:text-sm font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Shop Now
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Right copy (optional) */}
                {s.caption && (
                  <div className="pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 text-right text-white max-w-[60%] sm:max-w-none">
                    <p className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-wider drop-shadow-lg">{s.caption}</p>
                    {s.sub && <p className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-3xl tracking-widest drop-shadow-lg">{s.sub}</p>}
                  </div>
                )}
              </div>
            ))}

            {/* Play/Pause indicator */}
            <div
              className="absolute bottom-2 right-2 sm:right-3 grid h-8 w-8 place-items-center rounded-full bg-white/30 text-white backdrop-blur-sm z-20 cursor-pointer hover:bg-white/50 transition-colors"
              onClick={toggle}
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              )}
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${i === index ? "bg-white w-6 sm:w-8" : "bg-white/50 hover:bg-white/75"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
