"use client";

import {
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t text-gray-700">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Subscribe Section */}
        <div>
          <div className="mt-6">
            <h4 className="font-semibold">SABRI</h4>
            <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              Registered Address: Office No. A101/A102, S N - 26/2B, xxxxx, P.
              No. - 345, Lane No. 5, Kxxx, xxx, Mxxxx, India, 411xx.
            </p>
          </div>
        </div>

        {/* Policy */}
        <div>
          <h4 className="font-semibold mb-3 border-b w-fit border-black pb-1">
            Policy
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/policies/shipping-delivery-policy">
                Shipping & Delivery Policy
              </a>
            </li>
            <li>
              <a href="/policies/return-exchange-policy">
                Return & Exchange Policy
              </a>
            </li>
            <li>
              <a href="/policies/payment-policy">Payment Policy</a>
            </li>
            {/* <li>
              <a href="/faq">FAQ&apos;s</a>
            </li> */}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-semibold mb-3 border-b w-fit border-black pb-1">
            Help
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/contact-us">Contact Us</a>
            </li>
            <li>
              <a href="/policies/terms-of-service">Terms of Service</a>
            </li>
            <li>
              <a href="/policies/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/policies/return-exchange-policy">Return & Exchange</a>
            </li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h4 className="font-semibold mb-3 border-b w-fit border-black pb-1">
            About Us
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about-us">About Us</a>
            </li>
            <li>
              <a href="/contact-us">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social & Payment Section */}
      <div className="border-t py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-black" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-black" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-black" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
            All Rights Reserved © Haldar AI & IT
          </p>

          {/* Payment Icons */}
          <div className="flex space-x-2">
            <Image
              src="/footer/gp.png"
              alt="GPay"
              width={24}
              height={24}
              className="h-6"
            />
            <Image
              src="/footer/master.png"
              alt="Mastercard"
              width={24}
              height={24}
              className="h-6"
            />
            <Image
              src="/footer/pp.png"
              alt="PayPal"
              width={24}
              height={24}
              className="h-6"
            />
            <Image
              src="/footer/visa.png"
              alt="Visa"
              width={24}
              height={24}
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
