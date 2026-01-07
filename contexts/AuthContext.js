"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChange,
  loginWithEmailAndPasswordFirebase,
  registerWithEmailAndPasswordFirebase,
  loginWithGoogleFirebase,
  logoutFirebase,
  sendPhoneVerificationCodeFirebase,
  confirmPhoneNumberFirebase,
} from "@/lib/auth";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import the auth instance
import { initializePushNotifications } from "@/lib/notifications";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user data exists in localStorage
          const storedUser = localStorage.getItem("userData");
          const authToken = localStorage.getItem("authToken");

          if (storedUser && authToken) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            // Initialize push notifications for returning users
            console.log("🔔 AuthContext: Initializing push notifications for returning user");
            initializePushNotifications(userData._id || userData.id);
          } else if (authToken) {
            // If no stored data but have token, fetch from API
            const response = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            const data = await response.json();

            if (data.success) {
              setUser(data.data.user);
              localStorage.setItem("userData", JSON.stringify(data.data.user));
              // Initialize push notifications
              console.log("🔔 AuthContext: Initializing push notifications for user from API");
              initializePushNotifications(data.data.user._id || data.data.user.id);
            } else {
              setUser(null);
              localStorage.removeItem("userData");
              localStorage.removeItem("authToken");
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          localStorage.removeItem("userData");
          localStorage.removeItem("authToken");
        }
      } else {
        setUser(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginWithEmailAndPasswordFirebase(email, password);
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        localStorage.setItem("authToken", result.data.token);
        // Initialize push notifications
        initializePushNotifications(result.data.user._id || result.data.user.id);
      }
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (userData) => {
    try {
      const result = await registerWithEmailAndPasswordFirebase(userData);
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        localStorage.setItem("authToken", result.data.token);
        // Initialize push notifications
        initializePushNotifications(result.data.user._id || result.data.user.id);
      }
      return result;
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(error.message || "Signup failed");
    }
  };

  const googleLogin = async () => {
    try {
      const result = await loginWithGoogleFirebase();
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        localStorage.setItem("authToken", result.data.token);
        // Initialize push notifications
        initializePushNotifications(result.data.user._id || result.data.user.id);
      }
      return result;
    } catch (error) {
      console.error("Google login failed:", error);
      throw new Error(error.message || "Google login failed");
    }
  };

  const logout = async () => {
    try {
      const result = await logoutFirebase();
      if (result.success) {
        setUser(null);
      }
      return result;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error(error.message || "Logout failed");
    }
  };

  const sendPhoneVerificationCode = async (phoneNumber, appVerifier) => {
    try {
      const result = await sendPhoneVerificationCodeFirebase(
        phoneNumber,
        appVerifier
      );
      return result;
    } catch (error) {
      console.error("Error in AuthContext (sendPhoneVerificationCode):", error);
      throw new Error(error.message || "Failed to send verification code");
    }
  };

  const confirmPhoneNumber = async (confirmationResult, verificationCode) => {
    try {
      const result = await confirmPhoneNumberFirebase(
        confirmationResult,
        verificationCode
      );
      if (result.success) {
        setUser(result.data.user);
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        localStorage.setItem("authToken", result.data.token);
        // Initialize push notifications
        initializePushNotifications(result.data.user._id || result.data.user.id);
      }
      return result;
    } catch (error) {
      console.error("Error in AuthContext (confirmPhoneNumber):", error);
      throw new Error(error.message || "Failed to confirm phone number");
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    sendPhoneVerificationCode,
    confirmPhoneNumber,
    auth, // Expose the auth instance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
