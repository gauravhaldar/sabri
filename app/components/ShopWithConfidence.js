"use client";

import { Heart, Gem, Diamond } from "lucide-react";

export default function ShopWithConfidence() {
  const features = [
    {
      icon: <Heart className="w-10 h-10 mx-auto mb-4 text-black" />,
      title: "SKIN SAFE",
      description:
        "Our jewelry is hypoallergenic and skin-safe, crafted with care to ensure comfort for all skin types. Enjoy beautiful, irritation-free wear every day, knowing each piece is designed with your well-being in mind.",
    },
    {
      icon: <Gem className="w-10 h-10 mx-auto mb-4 text-black" />,
      title: "18K GOLD VERMEIL",
      description:
        "Our jewelry is crafted from premium metals like surgical steel, sterling silver, and thick 18k gold plating, ensuring durability and lasting shine. Experience luxury and quality with every piece, designed to stand the test of time.",
    },
    {
      icon: <Diamond className="w-10 h-10 mx-auto mb-4 text-black" />,
      title: "AUTHENTIC DIAMONDS",
      description:
        "Our lab-grown diamonds are SGL Certified, ensuring the highest standards of quality and authenticity same like natural diamonds. Each diamond undergoes rigorous testing to guarantee its brilliance and ethical origins.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-12 tracking-wide text-gray-900">
        SHOP WITH CONFIDENCE
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((item, index) => (
          <div key={index} className="bg-gray-50 px-6">
            <div className="flex flex-col items-center">
              {item.icon}
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
