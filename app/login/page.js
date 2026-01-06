"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RecaptchaVerifier } from "firebase/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifier = useRef(null);
  const authContext = useAuth();
  const { login, googleLogin, sendPhoneVerificationCode, confirmPhoneNumber } = authContext;

  // Debug logging
  console.log("AuthContext:", authContext);
  console.log("googleLogin function:", googleLogin);

  useEffect(() => {
    if (recaptchaContainerRef.current && !recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(
        authContext.auth, // Pass the Firebase auth instance
        recaptchaContainerRef.current,
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber. No need to do anything here as it's invisible.
          },
          "expired-callback": () => {
            setErrors({ general: "reCAPTCHA expired. Please try again." });
            setIsLoading(false);
          },
        }
      );
    }
  }, [authContext]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!phone) {
      setErrors({ phone: "Phone number is required" });
      setIsLoading(false);
      return;
    }

    try {
      if (!recaptchaVerifier.current) {
        setErrors({ general: "reCAPTCHA is not initialized. Please refresh the page." });
        setIsLoading(false);
        return;
      }
      await recaptchaVerifier.current.verify(); // Explicitly verify invisible recaptcha
      const result = await sendPhoneVerificationCode(phone, recaptchaVerifier.current);
      if (result.success) {
        setConfirmationResult(result.data);
        setResendTimer(30); // Start 30 second countdown
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("Phone login initiation error:", error);
      setErrors({
        general: error.message || "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // The simplest and most reliable approach is to reset the flow
    // Clear the confirmation result and reset the timer
    setConfirmationResult(null);
    setOtp("");
    setResendTimer(0);
    setErrors({});

    // Reload the page to get a fresh reCAPTCHA widget
    // This is necessary because Firebase reCAPTCHA can only be used once
    window.location.reload();
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!otp) {
      setErrors({ otp: "OTP is required" });
      setIsLoading(false);
      return;
    }

    if (!confirmationResult) {
      setErrors({ general: "No verification request found. Please resend code." });
      setIsLoading(false);
      return;
    }

    try {
      const result = await confirmPhoneNumber(confirmationResult, otp);
      if (result.success) {
        window.location.href = "/profile";
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrors({
        general: error.message || "OTP verification failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirect to profile page
        window.location.href = "/profile";
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: error.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-50 py-8 pt-40">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-neutral-600">Sign in to your Sabri account</p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${errors.email ? "border-red-500" : "border-neutral-300"
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${errors.password ? "border-red-500" : "border-neutral-300"
                      }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
                  />
                  <span className="ml-2 text-sm text-neutral-700">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-neutral-600 hover:text-neutral-800"
                >
                  Forgot password?
                </Link>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      if (!googleLogin) {
                        throw new Error(
                          "Google login not available. Please refresh the page."
                        );
                      }
                      const result = await googleLogin();
                      if (result.success) {
                        window.location.href = "/profile";
                      } else {
                        setErrors({ general: result.message });
                      }
                    } catch (error) {
                      console.error("Google login error:", error);
                      setErrors({
                        general:
                          error.message ||
                          "Google login failed. Please try again.",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>

                {/* Phone Number Login */}
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-neutral-900 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure '+91' is always at the beginning
                          if (!value.startsWith("+91")) {
                            setPhone("+91" + value.replace(/[^\d]/g, '').substring(2));
                          } else {
                            setPhone(value);
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${errors.phone ? "border-red-500" : "border-neutral-300"
                          }`}
                        placeholder="e.g., 9876543210"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                    <button
                      type="button"
                      onClick={handlePhoneLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center w-full px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      {isLoading ? "Sending Code..." : "Continue with Phone"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-neutral-900 mb-2"
                      >
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${errors.otp ? "border-red-500" : "border-neutral-300"
                          }`}
                        placeholder="Enter 6-digit code"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Code sent to {phone}
                      </p>
                      {errors.otp && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.otp}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleOtpSubmit}
                      disabled={isLoading}
                      className="flex items-center justify-center w-full px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </button>

                    {/* Resend OTP Button */}
                    <div className="flex items-center justify-center gap-2">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-neutral-500">
                          Resend code in <span className="font-medium text-neutral-700">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="text-sm font-medium text-neutral-900 hover:underline disabled:opacity-50 disabled:no-underline"
                        >
                          {isResending ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmationResult(null);
                        setOtp("");
                        setResendTimer(0);
                      }}
                      className="w-full text-sm text-neutral-600 hover:underline"
                    >
                      Change Phone Number
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-neutral-900 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
