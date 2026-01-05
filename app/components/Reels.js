"use client";

import React, { useState } from "react";
import Image from "next/image";

// Replace videoSrc values with your actual reel video paths, e.g. "/reels/r1.mp4"
const reels = [
  {
    id: 0,
    title: "Mysabri Silver Jewellery",
    videoSrc: "/reels/r1.mp4",
  },
  {
    id: 1,
    title: "Mysabri Silver Jewellery",
    videoSrc: "/reels/r2.mp4",
  },
  {
    id: 2,
    title: "Mysabri Silver Jewellery",
    videoSrc: "/reels/r3.mp4",
  },
];

export default function Reels() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reels.length - 1 ? 0 : prev + 1));
  };

  const activeReel = reels[activeIndex];

  return (
    <section className="mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-3.5">
          <Image
            src="/headings/focus us on.png"
            alt="Follow us on"
            width={320}
            height={71}
            className="h-auto object-contain"
          />
        </div>

        {/* Simple header (no mobile prev/next buttons) */}
        <div className="flex items-center justify-center mb-2.5 sm:mb-3.5">
          <p className="text-sm sm:text-base text-neutral-800 font-medium truncate">
            {activeReel.title}
          </p>
        </div>

        {/* 3-card 3D carousel layout for all breakpoints */}
        <div className="mt-2">
          <div className="relative w-full h-[420px] sm:h-[460px] md:h-[500px] flex items-center justify-center [perspective:1400px]">
            {reels.map((reel, index) => {
              const offset = index - activeIndex;
              const total = reels.length;
              let pos = (offset + total) % total;
              if (pos > Math.floor(total / 2)) {
                pos = pos - total;
              }

              const isCenter = pos === 0;
              const isSide = Math.abs(pos) === 1;

              const translateX = pos * 40; // percent
              const scale = isCenter ? 1 : isSide ? 0.85 : 0.7;
              const rotateY = pos * -10;
              const opacity = isCenter ? 1 : isSide ? 0.6 : 0;
              const visibility = Math.abs(pos) > 1 ? "hidden" : "visible";

              return (
                <div
                  key={reel.id}
                  className="absolute w-44 h-80 sm:w-52 sm:h-96 md:w-64 md:h-[480px] flex items-center justify-center transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex: isCenter ? 20 : isSide ? 10 : 1,
                    opacity,
                    visibility,
                  }}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <video
                      src={reel.videoSrc}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      loop
                      controls={isCenter}
                      autoPlay={isCenter}
                    />
                  </div>
                </div>
              );
            })}

            {/* Overlay arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-neutral-900 shadow hover:bg-white z-30"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-neutral-900 shadow hover:bg-white z-30"
            >
              &#8594;
            </button>
          </div>
        </div>
        
        {/* Instagram Link */}
        <div className="text-center mt-4 sm:mt-6">
          <a 
            href="https://www.instagram.com/mysabri.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-neutral-700 hover:text-neutral-900 font-medium transition-colors duration-200 border border-neutral-300 hover:border-neutral-900 px-4 py-2 rounded-full hover:shadow-md"
          >
            Click here
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
