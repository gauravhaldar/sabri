"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
              We Believe Demi-Fine Jewellery Is The Future
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              DEMIRNE FASHION PRIVATE LIMITED is the first demi-fine jewellery
              brand that was born out of a desire to offer affordable luxury to
              fashion-conscious women. Our aim is to make women feel confident,
              stylish, and empowered without breaking the bank. We strive to
              create a brand that empowers women to look and feel their best
              every day.
            </p>
          </div>
        </div>
      </div>

      {/* Palmonas X Shraddha Kapoor Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=600&fit=crop"
                  alt="Sabri X Shraddha Kapoor collaboration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Sabri X Shraddha Kapoor
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The story of the union of Sabri and Shraddha Kapoor is a tale of
                a mutual passion for jewellery and Shraddha&apos;s growing
                affinity for the brand and its motive. The Bollywood star&apos;s
                alliance with Sabri as a co-founder is undoubtedly a pivotal
                point in the legacy of our brand. We&apos;re honoured to have
                Shraddha Kapoor join our journey and deeply grateful for the
                continued support of all our customers. Together, we&apos;ll
                continue to create products that empower and inspire individuals
                to embrace their unique stories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Luxury made affordable for modern youth is a mission that is
                driven by the belief that everyone deserves to experience the
                pleasure and confidence that come from owning and wearing
                luxurious jewellery, regardless of their income or social
                status.
              </p>
            </div>

            {/* Image */}
            <div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop"
                  alt="Jewellery store interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About The Brand Store Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop"
                  alt="Sabri storefront"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                About The Brand Store
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We have been in business since 2022 as one of the first
                demi-fine jewellery brands. We design all of our original and
                eye-catching products in-house at our Pune-based headquarters,
                SABRI, and we now ship to over 200 countries. If you&apos;re in
                Pune, come say hello! Our store is located at Lane 5, Koregaon
                Park. We choose fashionable designs with high-quality
                craftsmanship that can be worn every day. Our demi-fine styles
                are the pinnacle of self-expression because they were made to be
                stacked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
