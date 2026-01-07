"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header
      className={`w-full absolute inset-x-0 top-0 z-50 transition-colors duration-300 group/nav hover:shadow-sm ${isHomePage ? "bg-transparent hover:bg-white" : "bg-white shadow-sm"
        }`}
    >
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-3 sm:px-1 lg:px-2">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
          {/* Brand logo (left) */}
          <div className="min-w-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/sabrilogo.png" // 👈 Replace this with your logo file path
                alt="Sabri Logo"
                width={80}
                height={40}
                sizes="(max-width: 640px) 112px, 200px"
                className={`h-8 w-auto sm:h-10 md:h-12 max-w-full transition-all duration-300 ${isHomePage
                    ? "brightness-0 invert group-hover/nav:brightness-100 group-hover/nav:invert-0"
                    : ""
                  }`}
                priority
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden rounded p-2 ${isHomePage
                ? "text-white group-hover/nav:text-neutral-900"
                : "text-neutral-900"
              }`}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          {/* Search (center) */}
          {/* <div className="hidden md:flex flex-1 items-center justify-center">
            <form
              className="relative w-full max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/search?q=${encodeURIComponent(
                  e.target.search.value
                )}`;
              }}
            >
              <div
                className={`pointer-events-none absolute -top-2 left-0 flex items-center gap-1 text-xs transition-colors duration-300 ${
                  isHomePage
                    ? "text-white/80 group-hover/nav:text-neutral-500"
                    : "text-neutral-500"
                }`}
              ></div>

              <input
                type="text"
                name="search"
                aria-label="Search"
                className={`w-full bg-transparent outline-none border-0 focus:ring-0 text-sm pt-1 transition-colors duration-300 ${
                  isHomePage
                    ? "text-white placeholder-white/60 group-hover/nav:text-neutral-900 group-hover/nav:placeholder-neutral-500"
                    : "text-neutral-900 placeholder-neutral-500"
                }`}
                placeholder="Search products..."
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-300 ${
                  isHomePage
                    ? "bg-white/50 group-hover/nav:bg-neutral-300"
                    : "bg-neutral-300"
                }`}
              ></span>
            </form>
          </div> */}

          {/* Icons (right) */}
          <nav
            aria-label="account-actions"
            className="hidden md:flex items-center gap-5 text-[13px]"
          >


            {/* Profile/Login */}
            <Link
              href="/profile"
              className={`group flex flex-col items-center gap-1 hover:opacity-90 transition-colors duration-300 ${isHomePage
                  ? "text-white group-hover/nav:text-neutral-900"
                  : "text-neutral-900"
                }`}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
                <path d="M4 22a8 8 0 0 1 16 0" />
              </svg>
            </Link>

            {/* Notifications */}
            <NotificationBell isHomePage={isHomePage} />

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`group relative flex flex-col items-center gap-1 hover:opacity-90 transition-colors duration-300 ${isHomePage
                  ? "text-white group-hover/nav:text-neutral-900"
                  : "text-neutral-900"
                }`}
            >
              <Heart className="h-6 w-6" strokeWidth="1.8" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`group relative flex flex-col items-center gap-1 hover:opacity-90 transition-colors duration-300 ${isHomePage
                  ? "text-white group-hover/nav:text-neutral-900"
                  : "text-neutral-900"
                }`}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h3l3.6 12.59a2 2 0 0 0 2 1.41h7.72a2 2 0 0 0 2-1.59l2.38-10.41H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden bg-white ${open ? "max-h-[420px]" : "max-h-0"
          }`}
      >
        <div className="mx-auto max-w-7xl px-3">
          {/* <form
            className="py-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              window.location.href = `/search?q=${encodeURIComponent(
                e.target.search.value
              )}`;
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              aria-label="Search"
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                isHomePage
                  ? "bg-white/95 text-neutral-900"
                  : "bg-white text-neutral-900"
              }`}
            />
          </form> */}

          <div className="grid grid-cols-2 gap-3 pb-3 text-sm">
            {[
              { name: "New Arrivals", href: "/new-arrivals" },
              { name: "Best Sellers", href: "/best-sellers" },
              // { name: "Fine Silver", href: "/fine-silver" },
              { name: "Bracelets", href: "/bracelets" },
              { name: "Necklaces", href: "/necklaces" },
              { name: "Rings", href: "/rings" },
              { name: "Earrings", href: "/earrings" },
              { name: "Ring Cum Bangle", href: "/ring-cum-bangle" },
              { name: "Mens", href: "/mens" },
              { name: "Gifts", href: "/gifts" },
              // { name: "Collections", href: "/collections" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-2 text-neutral-900"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t py-3">
            <Link
              href="/wishlist"
              className="flex items-center gap-2 relative"
              onClick={() => setOpen(false)}
            >
              <Heart className="h-5 w-5" strokeWidth="1.8" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span>Account</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 relative"
              onClick={() => setOpen(false)}
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Category Menu */}
      <div className="w-full hidden md:block">
        <div className="mx-auto max-w-7xl px-0 sm:px-1 lg:px-2">
          <div
            className={`flex flex-wrap items-center gap-x-8 lg:gap-x-14 gap-y-2 py-3 lg:py-4 text-sm lg:text-base transition-colors duration-300 ${isHomePage
                ? "text-white group-hover/nav:text-neutral-900"
                : "text-neutral-900"
              }`}
          >
            {[
              { name: "New Arrivals", href: "/new-arrivals" },
              { name: "Best Sellers", href: "/best-sellers" },
              // { name: "Fine Silver", href: "/fine-silver" },
              { name: "Bracelets", href: "/bracelets" },
              { name: "Necklaces", href: "/necklaces" },
              { name: "Rings", href: "/rings" },
              { name: "Earrings", href: "/earrings" },
              { name: "Ring Cum Bangle", href: "/ring-cum-bangle" },
              { name: "Mens", href: "/mens" },
              { name: "Gifts", href: "/gifts" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
