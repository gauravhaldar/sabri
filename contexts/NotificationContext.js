"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onForegroundMessage } from "@/lib/firebase";

const NotificationContext = createContext({});

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load notifications from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("notifications");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setNotifications(parsed);
                    setUnreadCount(parsed.filter((n) => !n.read).length);
                } catch (e) {
                    console.error("Error parsing stored notifications:", e);
                }
            }
        }
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== "undefined" && notifications.length > 0) {
            localStorage.setItem("notifications", JSON.stringify(notifications));
        }
    }, [notifications]);

    // Listen for foreground messages
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const unsubscribe = onForegroundMessage((payload) => {
                console.log("📬 Foreground notification received:", payload);
                addNotification({
                    id: Date.now().toString(),
                    title: payload.notification?.title || "Sabri Jewellery",
                    body: payload.notification?.body || "You have a new notification",
                    data: payload.data || {},
                    timestamp: new Date().toISOString(),
                    read: false,
                });
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        } catch (error) {
            console.error("Error setting up notification listener:", error);
        }
    }, []);

    // Add a notification
    const addNotification = useCallback((notification) => {
        setNotifications((prev) => {
            const newNotifications = [notification, ...prev].slice(0, 50); // Keep max 50 notifications
            return newNotifications;
        });
        setUnreadCount((prev) => prev + 1);
    }, []);

    // Mark a notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
        if (typeof window !== "undefined") {
            localStorage.removeItem("notifications");
        }
    }, []);

    // Add notification for order placement (called from outside)
    const addOrderNotification = useCallback((orderData) => {
        addNotification({
            id: `order-${orderData.orderId}-${Date.now()}`,
            title: "🎉 Order Placed Successfully!",
            body: `Your order #${orderData.orderId} has been placed. Total: ₹${orderData.orderSummary?.total?.toLocaleString() || "N/A"}`,
            data: { orderId: orderData.orderId, type: "order_confirmation" },
            timestamp: new Date().toISOString(),
            read: false,
        });
    }, [addNotification]);

    const value = {
        notifications,
        unreadCount,
        addNotification,
        addOrderNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
