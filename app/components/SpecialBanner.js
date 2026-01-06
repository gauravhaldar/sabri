"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Full-width special banner with title, autoplay, and click-to-pause functionality
export default function SpecialBanner({
  title = "GIFTING SPECIAL",
  slides = [
    { image: "/specialbanner/5.png", caption: "", sub: " ", cta: "SHOP NOW" },
    { image: "/specialbanner/3.png", caption: "", sub: " ", cta: "SHOP NOW" },
    { image: "/specialbanner/6.png", caption: "", sub: " ", cta: "SHOP NOW" },
    { image: "/specialbanner/4.png", caption: "", sub: "", cta: "SHOP NOW" },
  ],
  autoplayMs = 2000,
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
          onClick={toggle}
        >
          <div className="relative w-full" style={{ paddingBottom: '40%' }}>
            {slides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === index ? 1 : 0 }}
              >
                <Image 
                  src={s.image} 
                  alt={s.caption || "banner"} 
                  fill 
                  className="object-cover" 
                  priority={i === index} 
                />
                {/* Right copy (optional) */}
                {s.caption && (
                  <div className="pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 text-right text-white max-w-[60%] sm:max-w-none">
                    <p className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-wider drop-shadow-lg">{s.caption}</p>
                    {s.sub && <p className="mt-2 sm:mt-4 text-lg sm:text-xl md:text-3xl tracking-widest drop-shadow-lg">{s.sub}</p>}
                    {s.cta && (
                      <span className="mt-4 sm:mt-6 inline-block rounded border border-white/70 px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-widest backdrop-blur-sm bg-white/10">
                        {s.cta}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Play/Pause indicator */}
            <div className="absolute bottom-2 right-2 sm:right-3 grid h-8 w-8 place-items-center rounded-full bg-white/30 text-white backdrop-blur-sm">
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


