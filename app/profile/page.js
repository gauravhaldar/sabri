"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LoginPage from "../login/page";

export default function ProfilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    // This could check localStorage, cookies, or make an API call
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated, show profile page
  return <AuthenticatedProfile />;
}

// Separate component for authenticated user profile
function AuthenticatedProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(userData);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        setOrdersLoading(true);
        const res = await fetch(`/api/orders/user/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (e) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, user?.id]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to home
    window.location.href = "/";
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: "Orders", icon: "🛍️" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              My Account
            </h1>
            <p className="text-neutral-600">
              Welcome back, {user?.firstName || "User"}!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {user?.email && user.email.endsWith("@phone.firebase.local")
                      ? "Not provided"
                      : user?.email}
                  </p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          First Name
                        </label>
                        <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700">
                          {user?.firstName || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Last Name
                        </label>
                        <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700">
                          {user?.lastName || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Email Address
                        </label>
                        <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700">
                          {user?.email && user.email.endsWith("@phone.firebase.local")
                            ? "Not provided"
                            : user?.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Phone Number
                        </label>
                        <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700">
                          {user?.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Order History
                    </h2>
                    {ordersLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-4"></div>
                        <p className="text-neutral-600">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="text-4xl mb-4 block">🛍️</span>
                        <p className="text-neutral-600">No orders yet</p>
                        <Link
                          href="/best-sellers"
                          className="inline-block mt-4 px-4 py-2 bg-neutral-900 text-white rounded-md hover:opacity-90"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <a key={order.orderId} href={`/orders/${order.orderId}`} className="block border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                            <div className="flex items-center gap-4">
                              {order.items?.[0]?.image && (
                                <Image src={order.items[0].image} alt={order.items[0].name} width={64} height={64} className="w-16 h-16 rounded object-cover border border-neutral-200" />
                              )}
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-neutral-600">Order</p>
                                  <p className="font-medium text-neutral-900">#{order.orderId}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-neutral-600">Placed on</p>
                                  <p className="font-medium text-neutral-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-neutral-600">Status</p>
                                  <p className="font-medium capitalize">{order.status}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-neutral-600">Total</p>
                                  <p className="font-medium">₹{order.orderSummary?.total?.toLocaleString?.() || order.orderSummary?.total}</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
