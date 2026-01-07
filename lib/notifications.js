/**
 * Push Notification Utilities
 * Handles notification permission, FCM token management, and foreground message display
 */

import { getFCMToken, onForegroundMessage } from "./firebase";

// Register service worker for push notifications
export const registerServiceWorker = async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        console.log("Service workers not supported");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
        );
        console.log("Service Worker registered:", registration);
        return registration;
    } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
    }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
    if (typeof window === "undefined") return null;

    // Check if notifications are supported
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return null;
    }

    // Check current permission status
    if (Notification.permission === "denied") {
        console.log("Notification permission was denied");
        return null;
    }

    // Register service worker first
    await registerServiceWorker();

    // Get FCM token (this will also request permission)
    const token = await getFCMToken();
    return token;
};

// Save FCM token to backend
export const saveFCMTokenToBackend = async (token, userId) => {
    if (!token || !userId) return false;

    try {
        const response = await fetch("/api/auth/fcm-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, userId }),
        });

        const data = await response.json();
        if (data.success) {
            console.log("FCM token saved to backend");
            return true;
        } else {
            console.error("Failed to save FCM token:", data.message);
            return false;
        }
    } catch (error) {
        console.error("Error saving FCM token to backend:", error);
        return false;
    }
};

// Initialize push notifications for a user
export const initializePushNotifications = async (userId, showToast) => {
    console.log("🔔 initializePushNotifications: Starting for user:", userId);

    if (!userId) {
        console.log("🔔 initializePushNotifications: No userId provided");
        return false;
    }

    try {
        // Request permission and get token
        console.log("🔔 initializePushNotifications: Requesting permission...");
        const token = await requestNotificationPermission();

        if (!token) {
            console.log("🔔 initializePushNotifications: Could not get FCM token");
            return false;
        }

        console.log("🔔 initializePushNotifications: Got token, saving to backend...");
        // Save token to backend
        const saved = await saveFCMTokenToBackend(token, userId);

        if (saved) {
            console.log("🔔 initializePushNotifications: Token saved successfully");
            // Set up foreground message handler
            setupForegroundNotifications(showToast);
        } else {
            console.log("🔔 initializePushNotifications: Failed to save token");
        }

        return saved;
    } catch (error) {
        console.error("🔔 initializePushNotifications: Error:", error);
        return false;
    }
};

// Set up foreground notification handler
export const setupForegroundNotifications = (showToast) => {
    onForegroundMessage((payload) => {
        console.log("Foreground notification received:", payload);

        // Show a toast notification
        if (showToast) {
            showToast.success(
                payload.notification?.body || "You have a new notification",
                {
                    title: payload.notification?.title || "Sabri Jewellery",
                }
            );
        }

        // Also show a browser notification if the page is visible
        if (Notification.permission === "granted") {
            new Notification(payload.notification?.title || "Sabri Jewellery", {
                body: payload.notification?.body || "You have a new notification",
                icon: "/sabrilogo.png",
            });
        }
    });
};

// Show a local notification (for order success, etc.)
export const showLocalNotification = (title, body, data = {}) => {
    if (typeof window === "undefined") return;

    if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            body,
            icon: "/sabrilogo.png",
            badge: "/sabrilogo.png",
            tag: data.orderId || "local-notification",
            requireInteraction: true,
        });

        notification.onclick = () => {
            window.focus();
            if (data.orderId) {
                window.location.href = `/orders?id=${data.orderId}`;
            }
            notification.close();
        };
    }
};
