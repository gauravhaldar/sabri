"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationBell({ isHomePage = false }) {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Don't show if user is not logged in
    if (!user) return null;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex flex-col items-center gap-1 hover:opacity-90 transition-colors duration-300 ${isHomePage
                    ? "text-white group-hover/nav:text-neutral-900"
                    : "text-neutral-900"
                    }`}
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" strokeWidth={1.8} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-neutral-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-neutral-50">
                        <h3 className="font-semibold text-neutral-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Check className="h-3 w-3" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-neutral-400 hover:text-neutral-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-neutral-500">
                                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                                <p className="text-xs mt-1">You&apos;ll see order updates here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/50" : ""
                                            }`}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            if (notification.data?.orderId) {
                                                window.location.href = `/profile?tab=orders`;
                                                setIsOpen(false);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? "bg-blue-500" : "bg-transparent"
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-neutral-600 mt-0.5 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t bg-neutral-50 flex justify-between items-center">
                            <button
                                onClick={clearAll}
                                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                                <Trash2 className="h-3 w-3" />
                                Clear all
                            </button>
                            <span className="text-xs text-neutral-400">
                                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
