import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata = {
  title: "My Sabri",
  description: "Jewelry store",
  verification: {
    google: "gaFxstefSBbycHnFXMP-vkFOpXUAxrfLhWXf81ss5aQ",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F996MEE4EH"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F996MEE4EH');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <Navbar />
                {children}
                <Footer />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
