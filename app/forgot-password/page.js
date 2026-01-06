"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }

        try {
            // Use Firebase's built-in password reset
            // This ensures both Firebase Auth and the email are handled properly
            if (auth) {
                await sendPasswordResetEmail(auth, email);
            }
            setSuccess(true);
        } catch (error) {
            console.error("Forgot password error:", error);

            // User-friendly error messages
            let message = "Failed to send reset email. Please try again.";
            if (error.code === "auth/user-not-found") {
                message = "No account found with this email address.";
            } else if (error.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            } else if (error.code === "auth/too-many-requests") {
                message = "Too many requests. Please wait a few minutes and try again.";
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
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
                                Check Your Email
                            </h1>
                            <p className="text-neutral-600">
                                We have sent password reset instructions to your email
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
                                Email Sent Successfully
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                We have sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions to reset your password.
                            </p>
                            <p className="text-sm text-neutral-500 mb-6">
                                Did not receive the email? Check your spam folder or try again.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail("");
                                    }}
                                    className="w-full bg-neutral-100 text-neutral-700 py-3 px-4 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors"
                                >
                                    Try Another Email
                                </button>
                                <Link
                                    href="/login"
                                    className="block w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity text-center"
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

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
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
                            Forgot Password
                        </h1>
                        <p className="text-neutral-600">
                            Enter your email address and we will send you a link to reset your password
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
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
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError("");
                                        }}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 ${error ? "border-red-500" : "border-neutral-300"
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-1 text-xs text-red-600">{error}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-neutral-900 text-white py-3 px-4 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity duration-200"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        {/* Additional Links */}
                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-neutral-600">
                                Remember your password?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-neutral-900 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                            <p className="text-sm text-neutral-600">
                                Do not have an account?{" "}
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
