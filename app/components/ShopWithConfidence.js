"use client";

import Image from "next/image";

export default function ShopWithConfidence() {
  const features = [
    {
      image: "/swc/noskin.png",
      title: "No Skin Drama",
      description:
        " Our jewellery is hypoallergenic, anti-tarnish, and gentle on sensitive skin. No nickel. No brass. Just silver that loves you back.",
    },
    {
      image: "/swc/puresilver.png",
      title: "Pure Silver Indian Jewellery",
      description:
        "Each piece is carefully handcrafted by skilled silversmiths using the finest 925 sterling silver and finished with love to ensure it lasts generations, not just seasons. Whether it’s for a festive occasion or a casual coffee run, Mysabri’s silver jewellery adds the perfect touch of grace and confidence.",
    },
    {
      image: "/swc/fmf.png",
      title: "Fashion Meets Function",
      description:
        "Every clasp, chain, and stone at Mysabri is made with care. Our silver jewellery is designed to look beautiful and live beautifully with you — a reflection of modern luxury.",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-contain bg-no-repeat bg-center rounded-3xl px-6 py-6 sm:px-8 sm:py-12 md:px-12 md:py-14 lg:px-16 lg:py-16 xl:px-20 xl:py-18 mx-auto w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]" style={{backgroundImage: 'url(/shopwithconfidence/12.png)'}}>
            <div className="flex items-center justify-center h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
              <h2 className="text-[16px] sm:text-[20px] md:text-[22px] lg:text-[26px] xl:text-[30px] font-playfair font-bold tracking-[0.2em] text-gray-900 leading-tight" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                Shop with Confidence
              </h2>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white"
            >
              {/* Image Container */}
              <div className="relative mb-6 overflow-hidden">
                <div className="aspect-square bg-gray-50 border border-gray-100 overflow-hidden group-hover:border-gray-200 transition-all duration-500">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Minimal corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>

              {/* Content */}
              <div className="text-center px-2">
                <h3 className="text-[18px] sm:text-[20px] font-sans font-bold tracking-[0.1em] text-gray-900 mb-4 group-hover:text-neutral-800 transition-colors duration-300 leading-snug" style={{fontFamily: 'Georgia, "Times New Roman", serif'}}>
                  {item.title}
                </h3>
                
                <p className="text-[14px] sm:text-[15px] text-gray-600 leading-relaxed max-w-sm mx-auto group-hover:text-gray-700 transition-colors duration-300 font-light" style={{fontFamily: '"Crimson Text", Georgia, serif', lineHeight: '1.7'}}>
                  {item.description}
                </p>
                
                {/* Simple underline that expands */}
                <div className="mt-5 mx-auto h-px w-0 bg-gradient-to-r from-amber-600 to-rose-600 group-hover:w-16 transition-all duration-700 ease-out"></div>
              </div>

              {/* Subtle number indicator */}
              <div className="absolute top-4 left-4 text-xs text-gray-400 font-s opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{fontFamily: 'Georgia, serif'}}>
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        {/* <div className="text-center mt-16">
          <p className="text-xs text-gray-500 tracking-wider uppercase">
            Crafted with Precision & Care
          </p>
        </div> */}
      </div>
    </section>
  );
}
