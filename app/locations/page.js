"use client";

import Image from "next/image";

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Store Locations
          </h1>
          <p className="text-gray-700 text-lg">
            Visit our flagship store for an immersive jewelry experience
          </p>
        </div>

        {/* Store Layout: Image Left, Map Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Store Image - Left Side */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1000&h=750&fit=crop"
              alt="Sabri Brand Store Interior"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-semibold mb-1">Sabri Brand Store</h3>
              <p className="text-sm opacity-90">Koregaon Park, Pune</p>
            </div>
          </div>

          {/* Google Map - Right Side */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2654764113787!2d73.9048!3d18.5444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMyJzM5LjgiTiA3M8KwNTQnMTcuMyJF!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin&q=Koregaon+Park+Lane+5+Pune"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sabri Store Location"
              className="rounded-lg"
            ></iframe>
            
            {/* Map Overlay with Store Info */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Sabri Brand Store</h4>
              <p className="text-sm text-gray-700 mb-1">Lane No. 5, Koregaon Park</p>
              <p className="text-sm text-gray-700">Pune, Maharashtra 411001</p>
              <div className="mt-3">
                <a
                  href="https://maps.app.goo.gl/HEBfRZCVEPoEVEjd9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Store Description - Below Map */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Sunday</span>
                    <span className="font-medium">11:00 AM - 9:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    We're open 7 days a week to serve you better. 
                    Visit us anytime for a personalized jewelry shopping experience.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Lane No. 5, Koregaon Park, Pune</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>info@sabri.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect</h3>
              <p className="text-gray-700 leading-relaxed">
                Our flagship store in Koregaon Park offers an immersive jewelry experience with expert stylists, 
                personalized consultations, and exclusive collections. Whether you're looking for everyday pieces 
                or special occasion jewelry, our team is here to help you find the perfect pieces that reflect 
                your unique style and personality.
              </p>
            </div>
          </div>
        </div>

        {/* Services Available */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">In-Store Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Free Styling Consultation",
                description: "Personalized styling sessions with our expert stylists",
                icon: "✨"
              },
              {
                title: "Jewelry Cleaning",
                description: "Complimentary ultrasonic cleaning for all Sabri pieces",
                icon: "💎"
              },
              {
                title: "Repairs & Replating",
                description: "Professional repairs and 18k replating services",
                icon: "🔧"
              },
              {
                title: "Gift Wrapping",
                description: "Luxury gift wrapping and personalization services",
                icon: "🎁"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
