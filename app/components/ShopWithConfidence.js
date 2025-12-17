"use client";

export default function ShopWithConfidence() {
  const features = [
    {
      image: "/swc/noskin.jpeg",
      title: "No Skin Drama",
      description:
        "Our jewellery is hypoallergenic, anti-tarnish, and gentle on sensitive skin. No nickel. No brass. Just silver that loves you back.",
    },
    {
      image: "/swc/puresilver.jpeg",
      title: "Pure Silver Indian Jewellery",
      description:
        "Each piece is carefully handcrafted by skilled silversmiths using the finest 925 sterling silver and finished with love to ensure it lasts generations, not just seasons. Whether it’s for a festive occasion or a casual coffee run, Mysabri’s silver jewellery adds the perfect touch of grace and confidence.",
    },
    {
      image: "/swc/fmf.jpeg",
      title: "Fashion Meets Function",
      description:
        "Every clasp, chain, and stone at Mysabri is made with care. Our silver jewellery is designed to look beautiful and live beautifully with you — a reflection of modern luxury.",
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
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 mb-4 rounded-full object-cover border border-gray-200"
              />
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
