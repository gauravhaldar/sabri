"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-8MJZ78YD56", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-8MJZ78YD56"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
      >{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-8MJZ78YD56', { send_page_view: false });
      `}</Script>
    </>
  );
}