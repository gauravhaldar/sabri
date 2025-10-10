"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Simple coverflow-style slider with perspective tilt
export default function Slider({
  title = "for every you",
  slides = [
    { image: "/foryou/1.jpg", caption: "WEDDING WEAR" },
    { image: "/foryou/2.jpg", caption: "DAILY WEAR" },
    { image: "/foryou/3.jpg", caption: "OFFICE WEAR" },
  ],
  autoplayMs = 3500,
}) {
  const [index, setIndex] = useState(0);
  const [isSmall, setIsSmall] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia("(max-width: 640px)");
    const update = () => setIsSmall(mq ? mq.matches : window.innerWidth <= 640);
    update();
    mq && mq.addEventListener ? mq.addEventListener("change", update) : window.addEventListener("resize", update);
    return () => {
      mq && mq.removeEventListener ? mq.removeEventListener("change", update) : window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!autoplayMs) return;
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((p) => (p + 1) % slides.length), autoplayMs);
    return () => clearInterval(timer.current);
  }, [autoplayMs, slides.length]);

  const prev = () => setIndex((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setIndex((p) => (p + 1) % slides.length);

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-3 lg:px-4">
        <h2 className="text-center text-[16px] sm:text-[22px] md:text-[28px] tracking-wide uppercase mb-4 sm:mb-6">{title}</h2>

        <div className="relative overflow-x-clip">
          <div className="flex items-center justify-center gap-2 sm:gap-6 perspective-[1200px]">
            {slides.map((s, i) => {
              const offset = (i - index + slides.length) % slides.length;
              const isActive = offset === 0;
              const left = offset === 1 || (index === slides.length - 1 && i === 0);
              const right = offset === slides.length - 1 || (index === 0 && i === slides.length - 1);
              const baseClass = "relative h-[34vh] xs:h-[40vh] sm:h-[52vh] md:h-[60vh] w-[88vw] xs:w-[78vw] sm:w-[50vw] md:w-[45vw] max-w-[520px] min-w-[0] sm:min-w-[280px] rounded-xl overflow-hidden shadow-lg transition-all duration-700";
              let transform = "";
              let z = 0;
              if (isActive) {
                transform = "rotateY(0deg) translateZ(0px)";
                z = 30;
              } else if (left) {
                transform = isSmall ? "rotateY(8deg) translateX(-3%) scale(0.94)" : "rotateY(14deg) translateX(-6%) scale(0.92)";
                z = 20;
              } else if (right) {
                transform = isSmall ? "rotateY(-8deg) translateX(3%) scale(0.94)" : "rotateY(-14deg) translateX(6%) scale(0.92)";
                z = 20;
              } else {
                transform = "scale(0.78) opacity-0";
                z = 0;
              }
              return (
                <figure
                  key={i}
                  className={baseClass}
                  style={{ transform, zIndex: z }}
                >
                  <Image src={s.image} alt={s.caption} fill className="object-cover" sizes="(max-width:640px) 88vw, (max-width:1024px) 50vw, 45vw" />
                  <figcaption className="absolute inset-x-0 bottom-3 sm:bottom-6 text-center text-white text-sm sm:text-xl md:text-2xl font-medium tracking-wide">
                    {s.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <button onClick={prev} aria-label="Prev" className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 sm:p-3 hover:bg-black/60">‹</button>
          <button onClick={next} aria-label="Next" className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 sm:p-3 hover:bg-black/60">›</button>
        </div>
      </div>
    </section>
  );
}


