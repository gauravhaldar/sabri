"use client";

import Image from "next/image";

export default function StoresServicesPage() {
  const stores = [
    {
      city: "Pune",
      name: "Sabri Brand Store - Koregaon Park",
      address: "Lane No. 5, Koregaon Park, Pune, Maharashtra 411001",
      hours: "Mon–Sun, 11:00 AM – 9:00 PM",
      map: "https://maps.google.com/?q=Koregaon+Park+Lane+5+Pune",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&h=750&fit=crop",
    },
  ];

  const services = [
    {
      title: "Free Styling & Stacking Consultations",
      desc:
        "Book a 1:1 session with our stylists to curate your everyday stack.",
    },
    {
      title: "Jewellery Cleaning & Care",
      desc: "Complimentary ultrasonic cleaning for Sabri pieces.",
    },
    {
      title: "Repairs & Replating",
      desc: "Affordable repairs and 18k replating to refresh your favourites.",
    },
    {
      title: "Gift Personalisation",
      desc: "Greeting cards and luxe gift wrapping in-store.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Stores & Services
          </h1>
          <p className="text-gray-700 text-lg">
            Visit us for styling help, care services, and exclusive in-store drops.
          </p>
        </div>

        {/* Stores List */}
        <div className="space-y-10">
          {stores.map((s, idx) => (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <Image src={s.image} alt={s.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{s.name}</h3>
                <p className="text-gray-700 mt-2">{s.address}</p>
                <p className="text-gray-700 mt-1">Hours: {s.hours}</p>
                <div className="mt-4">
                  <a
                    href={s.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    View on Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">In-Store Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <div key={i} className="border rounded-lg p-6">
                <h4 className="text-xl font-semibold">{svc.title}</h4>
                <p className="text-gray-700 mt-2">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


