import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import LoadingScreen from "./components/LoadingScreen";

export const metadata = {
  title: "Silver Jewellery Set Online – Pure 925 Designs | Mysabri",
  description: "Shop premium silver jewellery set collections online at Mysabri. Pure 925 designs, elegant craftsmanship, and beautiful gifting options starting at just ₹999",
  verification: {
    google: "gaFxstefSBbycHnFXMP-vkFOpXUAxrfLhWXf81ss5aQ",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}

        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1244423037727066');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1244423037727066&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="antialiased">
        <LoadingScreen />
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <GoogleAnalytics />
                  <Navbar />
                  {children}
                  <Footer />
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
