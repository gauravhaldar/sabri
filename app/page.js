import VideoBanner from "./components/VideoBanner";
import Link from "next/link";
import OfferBanner from "./components/OfferBanner";
import Category from "./components/Category";
import TopSales from "./components/TopSales";
import GiftSection from "./components/GiftSection";
import Slider from "./components/Slider";
import SpecialBanner from "./components/SpecialBanner";
import Customers from "./components/Customers";
import ShopWithConfidence from "./components/ShopWithConfidence";
import Reels from "./components/Reels";
import TestimonialsFQ from "./components/Testimonials&FQ";
import Top from "./components/Top";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero banner */}
      <section className="relative">
        <VideoBanner src="/hero.mp4" poster="/hero.jpg" heightClass="h-[65svh] sm:h-[80svh] md:h-[95vh]">
          <div className="flex h-full w-full items-end justify-start">
            <div className="mb-8 ml-4 sm:mb-10 sm:ml-8 md:mb-16 md:ml-16 text-white">
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/90">Discover the new Sabri collection</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">Luxury Redefined</h1>
              <div className="mt-5 sm:mt-6">
                <Link href="/new-arrivals" className="inline-block rounded-md bg-[#6b4f3a] px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40">
                  Discover more
                </Link>
              </div>
            </div>
          </div>
        </VideoBanner>
      </section>

      {/* Sliding offers bar */}
      <OfferBanner />

      {/* Category grid section */}
      <Category />

      {/* Gifting edit section */}
      <GiftSection />

      {/* Special banner */}
      <SpecialBanner />

      {/* Coverflow slider */}
      {/* <Slider /> */}

      {/* Top sales section */}
      <TopSales />

      {/* Shop with confidence section */}
      <ShopWithConfidence />

      {/* Instagram Reels section */}
      <Reels />

      {/* Customers section */}
      {/* <Customers /> */}

      {/* Testimonials & FQ section */}
      <TestimonialsFQ />

      {/* Top section */}
      <Top />
    </div>
  );
}
