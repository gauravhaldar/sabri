"use client";

import { useState, useEffect, useRef } from "react";
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

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(userData);
    setEditForm({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      gender: userData.gender || "",
      dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
      profilePicture: userData.profilePicture || "",
    });
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        profilePicture: user?.profilePicture || "",
      });
      setImagePreview(null);
    }
    setIsEditing(!isEditing);
    setSaveMessage({ type: "", text: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSaveMessage({ type: "error", text: "Please select an image file" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({ type: "error", text: "Image size should be less than 5MB" });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage and state
        const updatedUser = { ...user, ...data.data.user };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        setImagePreview(null);
        setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setSaveMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: "Orders", icon: "🛍️" },
  ];

  const displayImage = imagePreview || user?.profilePicture || user?.profileImage || user?.image;

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
                  <div
                    className={`w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden relative ${isEditing ? 'cursor-pointer group' : ''}`}
                    onClick={handleImageClick}
                  >
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={`${user?.firstName || 'User'}'s profile`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        {user?.firstName ? (
                          <span className="text-2xl font-semibold text-neutral-600">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                          </span>
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Change</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
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
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === tab.id
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
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-neutral-900">
                        Profile Information
                      </h2>
                      <button
                        onClick={handleEditToggle}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${isEditing
                          ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                          }`}
                      >
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </button>
                    </div>

                    {/* Success/Error Message */}
                    {saveMessage.text && (
                      <div
                        className={`p-3 rounded-md text-sm ${saveMessage.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                      >
                        {saveMessage.text}
                      </div>
                    )}

                    {isEditing ? (
                      /* Edit Mode */
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={editForm.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={editForm.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                              placeholder="Enter last name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              Email Address
                            </label>
                            <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-500">
                              {user?.email && user.email.endsWith("@phone.firebase.local")
                                ? "Not provided"
                                : user?.email || "Not provided"}
                              <span className="text-xs ml-2">(Cannot be changed)</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={editForm.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                              placeholder="Enter phone number (e.g., +91XXXXXXXXXX)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              Gender
                            </label>
                            <select
                              name="gender"
                              value={editForm.gender}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-2">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={editForm.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Profile Picture Section in Edit Mode */}
                        <div className="border-t border-neutral-200 pt-6">
                          <label className="block text-sm font-medium text-neutral-900 mb-3">
                            Profile Picture
                          </label>
                          <div className="flex items-center gap-4">
                            <div
                              className="w-24 h-24 rounded-full overflow-hidden cursor-pointer group relative"
                              onClick={handleImageClick}
                            >
                              {displayImage ? (
                                <Image
                                  src={displayImage}
                                  alt="Profile preview"
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                  <span className="text-3xl">👤</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm">Change</span>
                              </div>
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={handleImageClick}
                                className="px-4 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                              >
                                Upload New Photo
                              </button>
                              <p className="text-xs text-neutral-500 mt-2">
                                JPG, PNG or GIF. Max size 5MB.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t border-neutral-200">
                          <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="px-6 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* View Mode */
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
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Gender
                          </label>
                          <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700 capitalize">
                            {user?.gender ? user.gender.replace('-', ' ') : "Not provided"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-900 mb-2">
                            Date of Birth
                          </label>
                          <div className="px-3 py-2 border border-neutral-300 rounded-md bg-neutral-50 text-neutral-700">
                            {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not provided"}
                          </div>
                        </div>
                      </div>
                    )}
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
