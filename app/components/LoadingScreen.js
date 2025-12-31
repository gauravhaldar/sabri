"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        // Start the exit animation after the zoom animation completes
        const animationTimer = setTimeout(() => {
            setAnimationComplete(true);
        }, 1800); // Logo zoom animation duration

        // Hide loading screen after fade out
        const hideTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2300); // Total time including fade out

        return () => {
            clearTimeout(animationTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#f8f5f2] via-white to-[#f5efe9] transition-opacity duration-500 ${animationComplete ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-[#6b4f3a]/5 to-transparent rounded-full animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-[#6b4f3a]/5 to-transparent rounded-full animate-pulse delay-500" />
            </div>

            {/* Logo container with zoom animation */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <div
                    className={`transform transition-all ease-out ${animationComplete
                            ? "scale-150 opacity-0"
                            : "animate-logo-zoom"
                        }`}
                >
                    <Image
                        src="/sabrilogo.png"
                        alt="Sabri Logo"
                        width={300}
                        height={150}
                        className="h-auto w-[120px] sm:w-[180px] md:w-[240px] lg:w-[300px]"
                        priority
                    />
                </div>

                {/* Loading indicator */}
                {/* <div
                    className={`mt-8 flex items-center gap-2 transition-opacity duration-300 ${animationComplete ? "opacity-0" : "opacity-100"
                        }`}
                >
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#6b4f3a] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#6b4f3a] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#6b4f3a] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div> */}
            </div>

            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
            </div>
        </div>
    );
}
