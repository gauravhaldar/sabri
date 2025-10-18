"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Minimal state - backend first approach
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);

  // Add to cart - Backend first, then sync frontend
  const addToCart = async (
    productId,
    quantity = 1,
    size = null,
    color = null
  ) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🔄 Adding to cart - Backend First Approach");
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);
    console.log("Size:", size);
    console.log("Color:", color);
    console.log("User ID:", user.id);

    try {
      setLoading(true);

      // 1. UPDATE BACKEND FIRST
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
          quantity,
          size,
          color,
        }),
      });

      const data = await response.json();
      console.log("📤 Backend Response:", data);

      if (data.success) {
        console.log("✅ Backend updated successfully");

        // 2. SYNC FRONTEND STATE with backend response
        setCartItems(data.cartData || {});
        setCartCount(data.cartCount || 0);

        console.log("🔄 Frontend state synced with backend");
        console.log("Cart Items:", data.cartData);
        console.log("Cart Count:", data.cartCount);

        return true;
      } else {
        console.error("❌ Backend update failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error in addToCart:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in cart (for UI state)
  const isInCart = (productId) => {
    const inCart = Object.values(cartItems).some(
      (item) => item.productId === productId
    );
    console.log(`🔍 Checking if ${productId} is in cart:`, inCart);
    return inCart;
  };

  // Update item quantity - Backend first
  const updateQuantity = async (cartKey, quantity) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🔄 Updating quantity - Backend First Approach");
    console.log("Cart Key:", cartKey);
    console.log("New Quantity:", quantity);

    try {
      setLoading(true);

      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cartKey,
          quantity,
        }),
      });

      const data = await response.json();
      console.log("📤 Update quantity backend response:", data);

      if (data.success) {
        console.log("✅ Quantity updated in backend successfully");
        setCartItems(data.cartData || {});
        setCartCount(data.cartCount || 0);
        return true;
      } else {
        console.error("❌ Backend quantity update failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error updating quantity:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart - Backend first
  const removeFromCart = async (cartKey) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }

    console.log("🗑️ Removing item from cart - Backend First Approach");
    console.log("Cart Key:", cartKey);

    try {
      setLoading(true);

      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          cartKey,
        }),
      });

      const data = await response.json();
      console.log("📤 Remove item backend response:", data);

      if (data.success) {
        console.log("✅ Item removed from backend successfully");
        setCartItems(data.cartData || {});
        setCartCount(data.cartCount || 0);
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

  // Clear entire cart - Optimistic local clear, then server sync if possible
  const clearCart = async () => {
    console.log("🧹 Clearing cart - Optimistic local clear, then server sync");

    // Always clear local state immediately for responsive UX
    setCartItems({});
    setCartCount(0);

    // If no user yet (e.g., during redirect hydration), skip server call
    if (!user?.id) {
      console.warn("⚠️ No user ID available; cleared local cart only for now.");
      // Caller can optionally call fetchCart() later when user is ready
      return true;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      console.log("📤 Clear cart backend response:", data);

      if (data.success) {
        console.log("✅ Cart cleared on server successfully");
        return true;
      } else {
        console.error("❌ Backend cart clear failed:", data.message);
        // Re-fetch to reconcile local vs server state if server failed
        try {
          await fetchCart();
        } catch {}
        return false;
      }
    } catch (error) {
      console.error("🚨 Error clearing cart:", error);
      // On error, re-fetch later; local state remains cleared
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend when user logs in
  const fetchCart = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log("📥 Fetching cart from backend for user:", user.id);

      const response = await fetch(`/api/cart/${user.id}`);
      const data = await response.json();

      console.log("📥 Raw backend cart response:", data);

      if (data.success) {
        console.log("✅ Cart fetched from backend successfully");
        console.log("📦 Cart data from backend:", data.cartData);
        console.log("📊 Cart count from backend:", data.cartCount);

        setCartItems(data.cartData || {});
        setCartCount(data.cartCount || 0);

        // Log each cart item for verification
        if (data.cartData) {
          Object.entries(data.cartData).forEach(([key, item]) => {
            console.log(`🛒 Cart item [${key}]:`, {
              name: item.name,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            });
          });
        }
      } else {
        console.error("❌ Failed to fetch cart:", data.message);
      }
    } catch (error) {
      console.error("🚨 Error fetching cart:", error);
    }
  }, [user?.id]); // Only recreate if user ID changes

  // Load cart when user changes
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    } else {
      // Clear state when user logs out
      setCartItems({});
      setCartCount(0);
    }
  }, [user]);

  const value = {
    // State
    cartItems,
    cartCount,
    loading,

    // Actions - Backend First Approach
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
