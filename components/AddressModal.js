"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  User,
  Phone,
  Mail,
  Building2,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

// Common country codes data
const countryCodes = [
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
  { code: "+1", country: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
  { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
  { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "+971", country: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+972", country: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "+54", country: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "+58", country: "VE", name: "Venezuela", flag: "🇻🇪" },
];

export default function AddressModal({
  isOpen,
  onClose,
  onAddressAdded,
  currentUser,
}) {
  const toast = useToast();
  const [address, setAddress] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [shippingValidation, setShippingValidation] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0]
  ); // Default to India
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const resetForm = useCallback(() => {
    setAddress({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    });
    setShippingValidation(null);
    setSelectedCountryCode(countryCodes[0]);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    setErrors({});
  }, [currentUser?.name, currentUser?.email]);

  // Validate shipping availability
  const validateShipping = async (zipCode) => {
    try {
      // For now, we'll simulate shipping validation
      // In a real app, you'd call your shipping API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Simulate shipping validation - assume delivery is available for most zip codes
      const isAvailable = zipCode.length >= 5;

      if (isAvailable) {
        setShippingValidation({
          available: true,
          data: {
            state: "Delhi", // Simulate state
            finalCharge: zipCode.startsWith("1") ? 0 : 50, // Simulate shipping cost
          },
        });
      } else {
        setShippingValidation({
          available: false,
          message: "Delivery not available for this location",
        });
      }
    } catch (error) {
      console.error("Error validating shipping:", error);
      setShippingValidation({
        available: false,
        message: "Error checking delivery availability",
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, currentUser, resetForm]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Remove all non-digits for validation
    const cleaned = phone.replace(/\D/g, "");
    // Phone should be between 6-15 digits (international standard)
    return cleaned.length >= 6 && cleaned.length <= 15;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (value && !validatePhone(value)) {
          newErrors.phone = "Phone number should be 6-15 digits";
        } else {
          delete newErrors.phone;
        }
        break;
      case "name":
        if (value && value.length < 2) {
          newErrors.name = "Name should be at least 2 characters";
        } else if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.name = "Name should only contain letters and spaces";
        } else {
          delete newErrors.name;
        }
        break;
      case "zipCode":
        if (value && !/^\d{4,10}$/.test(value)) {
          newErrors.zipCode = "Please enter a valid zip code (4-10 digits)";
        } else {
          delete newErrors.zipCode;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate shipping availability when zip code changes
  useEffect(() => {
    if (address.zipCode && address.zipCode.length >= 5) {
      validateShipping(address.zipCode);
    } else {
      setShippingValidation(null);
    }
  }, [address.zipCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For phone number, only allow digits, spaces, hyphens, and parentheses
    if (name === "phone") {
      const cleaned = value.replace(/[^\d\s\-\(\)]/g, "");
      setAddress((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      // Validate after a short delay to avoid constant validation while typing
      setTimeout(() => validateField(name, cleaned), 300);
    } else {
      setAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Validate other fields immediately
      if (["email", "name", "zipCode"].includes(name)) {
        setTimeout(() => validateField(name, value), 300);
      }
    }
  };

  const handleCountryCodeSelect = (countryCode) => {
    setSelectedCountryCode(countryCode);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
  };

  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.code.includes(countrySearchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validation
    const requiredFields = [
      "name",
      "email",
      "phone",
      "addressLine1",
      "city",
      "state",
      "zipCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !address[field].trim()
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate individual fields
    let hasValidationErrors = false;
    const validationErrors = {};

    // Email validation
    if (!validateEmail(address.email)) {
      validationErrors.email = "Please enter a valid email address";
      hasValidationErrors = true;
    }

    // Phone validation
    if (!validatePhone(address.phone)) {
      validationErrors.phone = "Phone number should be 6-15 digits";
      hasValidationErrors = true;
    }

    // Name validation
    if (address.name.length < 2) {
      validationErrors.name = "Name should be at least 2 characters";
      hasValidationErrors = true;
    } else if (!/^[a-zA-Z\s]+$/.test(address.name)) {
      validationErrors.name = "Name should only contain letters and spaces";
      hasValidationErrors = true;
    }

    // Zip code validation
    if (!/^\d{4,10}$/.test(address.zipCode)) {
      validationErrors.zipCode = "Please enter a valid zip code (4-10 digits)";
      hasValidationErrors = true;
    }

    if (hasValidationErrors) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    // Check if shipping is available
    if (!shippingValidation || !shippingValidation.available) {
      toast.error("Please enter a valid zip code where we deliver");
      return;
    }

    setLoading(true);

    try {
      // Here you would typically save the address to your backend
      // For now, we'll just simulate success and pass the address data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const addressWithShipping = {
        ...address,
        phoneWithCountryCode: `${selectedCountryCode.code} ${address.phone}`,
        countryCode: selectedCountryCode,
        shippingInfo: shippingValidation.data,
      };

      onAddressAdded(addressWithShipping);
      toast.success("Address added successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    // Check if running in secure context (required for geolocation)
    if (window.isSecureContext === false) {
      toast.error("Geolocation requires a secure connection (HTTPS)");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log("Location coordinates:", { latitude, longitude });

          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
          }

          const data = await response.json();
          console.log("Geocoding response:", data);

          if (data) {
            let detectedZipCode = data.postcode || "";
            let detectedCity = data.city || data.locality || "";
            let detectedState = data.principalSubdivision || "";
            let detectedAddressLine = "";

            // Try to build address from localityInfo
            if (data.localityInfo?.administrative) {
              const adminLevels = data.localityInfo.administrative;
              // Get the most specific locality name for address line
              detectedAddressLine = adminLevels[adminLevels.length - 1]?.name ||
                adminLevels[adminLevels.length - 2]?.name || "";

              // Fallback for city if not found
              if (!detectedCity && adminLevels.length >= 3) {
                detectedCity = adminLevels[2]?.name || adminLevels[1]?.name || "";
              }

              // Fallback for state
              if (!detectedState && adminLevels.length >= 2) {
                detectedState = adminLevels[1]?.name || "";
              }
            }

            // If no zip code found, try alternative geocoding service
            if (!detectedZipCode) {
              try {
                console.log("Trying fallback geocoding for zip code...");
                const fallbackResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                  {
                    headers: {
                      'User-Agent': 'SabriApp/1.0'
                    }
                  }
                );
                const fallbackData = await fallbackResponse.json();
                console.log("Fallback geocoding response:", fallbackData);

                detectedZipCode = fallbackData.address?.postcode || "";

                // Also try to get more address details from fallback
                if (!detectedCity) {
                  detectedCity = fallbackData.address?.city ||
                    fallbackData.address?.town ||
                    fallbackData.address?.village || "";
                }
                if (!detectedState) {
                  detectedState = fallbackData.address?.state || "";
                }
                if (!detectedAddressLine && fallbackData.address) {
                  detectedAddressLine = fallbackData.address?.suburb ||
                    fallbackData.address?.neighbourhood ||
                    fallbackData.address?.road || "";
                }
              } catch (fallbackError) {
                console.log("Fallback geocoding failed:", fallbackError);
              }
            }

            // Update address fields with geocoded data
            setAddress(prev => ({
              ...prev,
              addressLine1: detectedAddressLine || prev.addressLine1,
              city: detectedCity || prev.city,
              state: detectedState || prev.state,
              zipCode: detectedZipCode || prev.zipCode,
              country: data.countryName || "India"
            }));

            // Provide specific feedback about zip code detection
            if (detectedZipCode) {
              toast.success(`Location detected! Zip code: ${detectedZipCode}`);
              // Validate shipping for the detected zip code
              await validateShipping(detectedZipCode);
            } else if (detectedCity || detectedState) {
              toast.success("Location detected! Please enter your zip code manually.");
            } else {
              toast.error("Could not determine address from location. Please enter manually.");
            }
          } else {
            toast.error("Could not determine address from location");
          }
        } catch (error) {
          console.error("Error getting address from coordinates:", error);
          toast.error("Failed to get address from location. Please enter manually.");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        console.error("Error code:", error.code, "Message:", error.message);

        let errorMessage = "Failed to get your location";

        // Use numeric codes for GeolocationPositionError
        // 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access denied. Please allow location access in your browser settings and try again.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location information is unavailable. Please check your device's location settings.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = `Location error: ${error.message || 'Unknown error'}`;
        }

        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: false, // Set to false for faster response, more reliable
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add Delivery Address
                  </h2>
                  <p className="text-sm text-gray-500">
                    We&apos;ll check if we deliver to your location
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                          }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex">
                        {/* Country Code Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setIsCountryDropdownOpen(!isCountryDropdownOpen)
                            }
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[100px] bg-white"
                          >
                            <span>{selectedCountryCode.flag}</span>
                            <span className="text-sm font-medium">
                              {selectedCountryCode.code}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                              {/* Search Input */}
                              <div className="p-2 border-b border-gray-200">
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={countrySearchTerm}
                                  onChange={(e) =>
                                    setCountrySearchTerm(e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>

                              {/* Countries List */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountryCodes.map((country) => (
                                  <button
                                    key={`${country.code}-${country.country}`}
                                    type="button"
                                    onClick={() =>
                                      handleCountryCodeSelect(country)
                                    }
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${selectedCountryCode.code ===
                                        country.code &&
                                        selectedCountryCode.country ===
                                        country.country
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-900"
                                      }`}
                                  >
                                    <span className="text-lg">
                                      {country.flag}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">
                                        {country.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {country.code}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                {filteredCountryCodes.length === 0 && (
                                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                    No countries found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone Input */}
                        <input
                          type="tel"
                          name="phone"
                          value={address.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className={`flex-1 px-3 py-2 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                            }`}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={address.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300"
                        }`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      Address Information
                    </h3>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      {isGettingLocation ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Getting Location...
                        </>
                      ) : (
                        "Get My Location"
                      )}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House/Flat/Building No., Street Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Area, Landmark (Optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={address.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.zipCode
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300"
                            }`}
                          required
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.zipCode}
                          </p>
                        )}
                        {/* Shipping Validation Message */}
                        {address.zipCode && address.zipCode.length >= 5 && (
                          <div className="mt-2">
                            {shippingValidation === null ? (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                Checking delivery availability...
                              </div>
                            ) : shippingValidation.available ? (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                ✅ We deliver to {shippingValidation.data.state}
                                !
                                <span className="text-gray-600">
                                  Shipping: ₹
                                  {shippingValidation.data.finalCharge}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-red-600">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                ❌ {shippingValidation.message}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={address.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !shippingValidation?.available}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Click outside dropdown to close */}
          {isCountryDropdownOpen && (
            <div
              className="fixed inset-0 z-[5]"
              onClick={() => setIsCountryDropdownOpen(false)}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
