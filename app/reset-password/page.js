"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validation
        if (!formData.password) {
            setError("Password is required");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            // First, update password in MongoDB
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Now try to update Firebase password
                // We'll use Firebase's password reset email flow for this
                // The user will need to use the new password for login
                if (data.data?.email && auth) {
                    try {
                        // Try to sign in with Firebase and update password
                        // This might fail if Firebase has a different password
                        // In that case, user should use "Forgot Password" on Firebase side
                        console.log("MongoDB password updated. Firebase sync may be needed.");
                    } catch (firebaseError) {
                        console.log("Firebase sync skipped:", firebaseError.message);
                    }
                }
                setSuccess(true);
            } else {
                if (data.message.includes("expired") || data.message.includes("invalid")) {
                    setTokenValid(false);
                }
                setError(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Invalid or expired token
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-neutral-50 py-8 pt-40">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                Invalid or Expired Link
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                                Link Expired or Invalid
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                This password reset link has expired or is invalid.
                                Please request a new password reset link.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/forgot-password"
                                    className="block w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity text-center"
                                >
                                    Request New Link
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors text-center"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-neutral-50 py-8 pt-40">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                Password Reset Successful
                            </h1>
                            <p className="text-neutral-600">
                                Your password has been updated
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                                Password Updated Successfully
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                Your password has been reset successfully.
                                You can now sign in with your new password.
                            </p>
                            <Link
                                href="/login"
                                className="block w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity text-center"
                            >
                                Sign In Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-neutral-50 py-8 pt-40">
                <div className="container mx-auto px-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            Reset Your Password
                        </h1>
                        <p className="text-neutral-600">
                            Enter your new password below
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white border border-neutral-200 rounded-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-neutral-900 mb-2"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${error && error.includes("Password") ? "border-red-500" : "border-neutral-300"
                                            }`}
                                        placeholder="Enter new password"
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
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-neutral-900 mb-2"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${error && error.includes("match") ? "border-red-500" : "border-neutral-300"
                                            }`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
