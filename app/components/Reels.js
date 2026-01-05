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
            width={180}
            height={40}
            className="h-auto object-contain"
          />
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
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
