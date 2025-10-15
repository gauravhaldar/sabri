"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Contact Us</h1>
          <p className="text-gray-700 text-lg">
            We’re here to help with orders, sizing, care, or anything Sabri.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card: Email */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              Get a response within 24 hours on business days.
            </p>
            <a href="mailto:haldarainit@gmail.com" className="text-black underline">
            haldarainit@gmail.com
            </a>
          </div>

          {/* Card: Phone */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon–Sat, 10:00 AM – 7:00 PM IST</p>
            <a href="tel:+911234567890" className="text-black underline">
              +91 8770672422
            </a>
          </div>

          {/* Card: WhatsApp */}
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">Quick queries and order updates</p>
            <a
              href="https://wa.me/8770672422"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Store Address & Map */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Head Office & Store</h2>
            <p className="text-gray-700 leading-relaxed">
            Industrial Ecommerce , engineering park Heavy Industrial Area Hathkhoj, Plot No-173, 490024 Hathkhoj CG, India
            </p>
            {/* <p className="text-gray-700 mt-2">Open: Mon–Sun, 11:00 AM – 9:00 PM</p> */}
            {/* <div className="mt-6 flex gap-4">
              <a
                href="https://maps.google.com/?q=Koregaon+Park+Lane+5+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Get Directions
              </a>
              <Link href="/stores-services" className="px-4 py-2 border rounded-md hover:bg-gray-50">
                Stores & Services
              </Link>
            </div> */}
          </div>

          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&h=750&fit=crop"
              alt="Sabri Store"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* FAQ Teaser */}
        {/* <div className="mt-16 text-center">
          <p className="text-gray-700">Looking for quick answers?</p>
          <Link href="/faq" className="text-black underline">
            Visit our FAQs
          </Link>
        </div> */}
      </div>
    </div>
  );
}


