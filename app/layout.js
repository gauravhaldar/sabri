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
