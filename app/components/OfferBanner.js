"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export default function OfferBanner({
  offers = [
    "Flat 10% off on Charms",
    "Buy 2 get 1 Free on Rings",
    "Free Engraving this week",
    "New Lab-grown diamonds collection",
  ],
  speed = 40, // pixels per second
  repeat = 4, // how many times to duplicate the offers for a longer loop
  gapClass = "gap-16", // spacing between offers
}) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [couponOffers, setCouponOffers] = useState([]);

  // Fetch active coupons and turn them into banner messages
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/coupons?status=active`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.success || !Array.isArray(data?.data)) return;

        const messages = data.data.map((c) => {
          const code = c.code ? `Use ${c.code}` : "";
          const name = c.name || "Special Offer";
          const discount = c.type === "percentage"
            ? `${c.amount}% OFF`
            : c.type === "flat"
            ? `Save ₹${c.amount}`
            : "Offer";
          const min = typeof c.minValue === "number" ? `Min ₹${c.minValue}` : "";
          return [name, discount, code, min].filter(Boolean).join(" • ");
        });
        setCouponOffers(messages.filter(Boolean));
      } catch (_) {
        // ignore
      }
    })();
    return () => controller.abort();
  }, []);

  // Choose fetched coupons when available, otherwise fall back to provided offers
  const bannerItems = useMemo(() => {
    const base = couponOffers.length > 0 ? couponOffers : offers;
    return Array.from({ length: Math.max(2, repeat) }).flatMap(() => base);
  }, [couponOffers, offers, repeat]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let start = null;
    let offset = 0;
    const step = (ts) => {
      if (start == null) start = ts;
      const dt = (ts - start) / 1000; // seconds
      start = ts;
      offset -= speed * dt;
      const width = track.scrollWidth / 2; // half because we duplicate content
      if (Math.abs(offset) >= width) offset += width; // loop seamlessly
      track.style.transform = `translateX(${offset}px)`;
      raf = requestAnimationFrame(step);
    };
    let raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed, bannerItems]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-neutral-900 text-white">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-neutral-900/80 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-neutral-900/80 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-0 sm:px-1 lg:px-2">
        <div className="flex items-center gap-3 py-3">
          <div className="relative flex-1">
            <div ref={trackRef} className={`flex ${gapClass} will-change-transform`}>
              {bannerItems.map((text, idx) => (
                <span key={`${text}-${idx}`} className="whitespace-nowrap text-sm">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


