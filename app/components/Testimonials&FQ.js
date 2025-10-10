"use client";

import React from "react";

export default function TestimonialsFQ() {
  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28 font-sans text-neutral-800">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Heading */}
        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl font-serif font-normal uppercase tracking-wide mb-8 text-neutral-900">
          Buy Everyday Demi-Fine Jewellery, Curated by Shraddha Kapoor
        </h1>

        <p className="text-left text-lg sm:text-xl font-light text-neutral-700 mb-12 italic">
          Sabri Jewellery – Everyday Luxury That Doesn’t Sit in a Box
        </p>

        <div className="space-y-10 text-neutral-700 text-[15px] sm:text-base leading-relaxed">
          <p>
            Welcome to Sabri, where modern minimalism meets real-life wearability. We design demi-fine jewellery that looks like luxury, feels like a second skin, and outlasts your longest days. Our pieces are made with 925 sterling silver, surgical-grade stainless steel, and finished with thick layers of rhodium, 18k gold vermeil, and 18k gold tone plating — so you never have to babysit your jewellery or wait for an occasion to wear it.
          </p>

          <p>
            From office days to off-duty plans, from subtle to statement, we’re here to make jewellery that works as hard as you do. Think of us as the quiet flex in your everyday look — waterproof, skin-safe, and made to show up every single day.
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal mt-12 mb-4 text-neutral-900">
            Sabri Jewellery That Belongs in Your Daily Lineup — Not Locked in a Drawer
          </h2>

          <p>
            At Sabri, we don’t think jewellery should be reserved for “special occasions” or kept in a box waiting for its moment. It should be something you throw on without thinking — and still feel put together every time.
          </p>

          <p>
            Our pieces are made for real life — the kind where you're rushing out the door, jumping from work to dinner, or stuffing everything into one weekend bag. No overthinking. Just great-looking jewellery that shows up with you, wherever you're going.
          </p>

          <p>
            That’s what sets us apart. Not too precious. Not too flashy. Just intentionally made, beautifully finished pieces that feel like you — on your best days and your busiest ones.
          </p>

          <h3 className="text-lg sm:text-xl font-normal mt-8 text-neutral-900">
            Our materials speak for themselves:
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Long-lasting gold plated, rhodium, and gold tone plated jewellery that doesn’t flake or fade</li>
            <li>Sparkling lab grown diamond jewellery with zero mining guilt</li>
            <li>Hypoallergenic, tarnish-resistant, and always sweatproof</li>
            <li>Designed for layering, gifting, stacking, or simply wearing solo</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal mt-12 mb-4 text-neutral-900">
            Find the Jewellery That Fits Your Everyday Life
          </h2>

          {/* Category Sections */}
          <div className="space-y-8">
            {[
              ["Necklaces That Do More Than Just Look Good", "Our necklaces collection is where subtle shine meets versatile design. Whether it’s a kurta kind of day or just jeans and a tee, our styles slip in without trying too hard."],
              ["Chains That Keep It Clean and Confident", "Whether you prefer bold links or barely-there shimmer, our gold plated chain options are made to last — no tarnish, no green skin, no stress."],
              ["Earrings That You Can Sleep In", "We get it — earrings that look great but irritate your ears? Hard pass. That’s why we’ve designed a range of gold earrings for women that are light on your lobes but heavy on polish."],
              ["Rings That Aren’t Just for “Occasions”", "Your hands do a lot — your rings should keep up. We craft gold rings for women that are refined yet functional."],
              ["Bracelets That Go Beyond Accessory Status", "Your wristwear should feel like part of your personality, not an afterthought. Our bracelets for women are crafted to be comfortable, durable, and meaningful."],
              ["Bangles That Are Built to Stay Beautiful", "We’ve taken the traditional bangle and made it stronger, sleeker, and more wearable. No jangly chaos here — just refined, intentional styling."],
              ["Mangalsutra, Modernised", "Tradition meets subtlety in our take on the silver mangalsutra. Designed for daily wear, each piece feels modern, light, and versatile — not weighed down by ornate bulk."],
            ].map(([title, desc], idx) => (
              <div key={idx}>
                <h3 className="font-normal text-lg sm:text-xl mb-2 text-neutral-900">{title}</h3>
                <p className="font-light">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal mt-12 mb-4 text-neutral-900">
            More Than Looks — What Makes Sabri Different
          </h2>

          <ul className="list-disc list-inside space-y-3 ml-4 font-light">
            <li>Crafted for Now: Jewellery that keeps up with your lifestyle — tested for comfort, longevity, and versatility.</li>
            <li>Thoughtful Materials: Using 925 sterling silver, surgical-grade steel, and thick rhodium or gold finishes.</li>
            <li>No Skin Drama: Hypoallergenic, nickel-free, and tarnish-resistant for sensitive skin.</li>
            <li>Designed for You: Proudly co-designed by Shraddha Kapoor, blending minimal glam with personal charm.</li>
            <li>Fashion Meets Function: Jewellery that’s built to last — from clasps to shine.</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal mt-12 mb-4 text-neutral-900">
            Gifting, Sorted — Jewellery Worth Sharing (or Keeping)
          </h2>
          <p className="font-light">
            Jewellery that actually gets worn? That’s the kind worth gifting. Our pieces make perfect presents for birthdays, anniversaries, weddings, or just because.
          </p>

          {/* FAQs */}
          <h2 className="text-3xl font-serif font-normal mt-16 mb-6 text-left text-neutral-900">
            FAQs — Your Questions, Our Straight Answers
          </h2>

          <div className="space-y-8">
            {[
              ["What is demi-fine jewellery, exactly?", "Demi-fine jewellery sits between fine and fashion — made with 925 silver or surgical steel and plated with gold or rhodium for everyday luxury."],
              ["How long does gold plated jewellery actually last?", "With proper care, years. Sabri uses thick 18k plating over high-quality metals, not cheap brass."],
              ["Can I wear Sabri jewellery in the shower?", "Yes, most of it is waterproof, but for maximum shine, avoid harsh soaps and perfumes."],
              ["Will Sabri jewellery turn my skin green?", "No. We use 925 silver and stainless steel — no nickel, no brass, no green tint."],
              ["Is lab grown diamond real?", "Yes — it’s chemically identical to mined diamonds, just made sustainably in a lab."],
              ["How do I take care of my demi-fine jewellery?", "Keep it dry, avoid strong chemicals, and clean with a soft cloth. Every Sabri piece comes with a care guide."],
              ["Can men wear Sabri jewellery?", "Definitely. We offer gold chains, rings, and bracelets designed for subtle, stylish, all-day wear."],
            ].map(([q, a], idx) => (
              <div key={idx}>
                <h3 className="font-normal text-lg sm:text-xl mb-2 text-neutral-900">{q}</h3>
                <p className="font-light">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
