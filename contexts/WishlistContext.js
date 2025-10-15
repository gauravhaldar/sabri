"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  // Minimal state - backend first approach
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const [wishlistCount, setWishlistCount] = useState(0);

  // Add to wishlist - Backend first, then sync frontend
  const addToWishlist = async (productId) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🔄 Adding to wishlist - Backend First Approach");
    console.log("Product ID:", productId);
    console.log("User ID:", user.id);

    try {
      setLoading(true);

      // 1. UPDATE BACKEND FIRST
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
        }),
      });

      const data = await response.json();
      console.log("📤 Backend Response:", data);

      if (data.success) {
        console.log("✅ Backend updated successfully");

        // 2. SYNC FRONTEND STATE with backend response
        setWishlistItems(data.wishlistData || {});
        setWishlistCount(data.wishlistCount || 0);

        console.log("🔄 Frontend state synced with backend");
        console.log("Wishlist Items:", data.wishlistData);
        console.log("Wishlist Count:", data.wishlistCount);

        return true;
      } else {
        console.error("❌ Backend update failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error in addToWishlist:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist (for UI state)
  const isInWishlist = (productId) => {
    const inWishlist = wishlistItems.hasOwnProperty(productId);
    console.log(`🔍 Checking if ${productId} is in wishlist:`, inWishlist);
    return inWishlist;
  };

  // Remove item from wishlist - Backend first
  const removeFromWishlist = async (productId) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🗑️ Removing item from wishlist - Backend First Approach");
    console.log("Product ID:", productId);

    try {
      setLoading(true);

      const response = await fetch("/api/wishlist/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
        }),
      });

      const data = await response.json();
      console.log("📤 Remove item backend response:", data);

      if (data.success) {
        console.log("✅ Item removed from backend successfully");
        setWishlistItems(data.wishlistData || {});
        setWishlistCount(data.wishlistCount || 0);
        return true;
      } else {
        console.error("❌ Backend item removal failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error removing item:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist item (add if not in wishlist, remove if in wishlist)
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Clear entire wishlist - Backend first
  const clearWishlist = async () => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🧹 Clearing wishlist - Backend First Approach");

    try {
      setLoading(true);

      const response = await fetch("/api/wishlist/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();
      console.log("📤 Clear wishlist backend response:", data);

      if (data.success) {
        console.log("✅ Wishlist cleared from backend successfully");
        setWishlistItems({});
        setWishlistCount(0);
        return true;
      } else {
        console.error("❌ Backend wishlist clear failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error clearing wishlist:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist from backend when user logs in
  const fetchWishlist = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log("📥 Fetching wishlist from backend for user:", user.id);

      const response = await fetch(`/api/wishlist/${user.id}`);
      const data = await response.json();

      console.log("📥 Raw backend wishlist response:", data);

      if (data.success) {
        console.log("✅ Wishlist fetched from backend successfully");
        console.log("📦 Wishlist data from backend:", data.wishlistData);
        console.log("📊 Wishlist count from backend:", data.wishlistCount);

        setWishlistItems(data.wishlistData || {});
        setWishlistCount(data.wishlistCount || 0);

        // Log each wishlist item for verification
        if (data.wishlistData) {
          Object.entries(data.wishlistData).forEach(([key, item]) => {
            console.log(`❤️ Wishlist item [${key}]:`, {
              name: item.name,
              productId: item.productId,
              price: item.price,
            });
          });
        }
      } else {
        console.error("❌ Failed to fetch wishlist:", data.message);
      }
    } catch (error) {
      console.error("🚨 Error fetching wishlist:", error);
    }
  }, [user?.id]); // Only recreate if user ID changes

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    } else {
      // Clear state when user logs out
      setWishlistItems({});
      setWishlistCount(0);
    }
  }, [user]);

  const value = {
    // State
    wishlistItems,
    wishlistCount,
    loading,

    // Actions - Backend First Approach
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
