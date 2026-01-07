import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;
let googleProvider;
let phoneProvider;
let db;
let messaging;

if (typeof window !== "undefined") {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  phoneProvider = new PhoneAuthProvider();
  db = getFirestore(app);
}

// Get FCM token for push notifications
export const getFCMToken = async () => {
  if (typeof window === "undefined") return null;

  console.log("🔔 getFCMToken: Starting...");

  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("🔔 getFCMToken: Notifications not supported");
      return null;
    }

    // Check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      console.log("🔔 getFCMToken: Service workers not supported");
      return null;
    }

    // Register service worker first
    console.log("🔔 getFCMToken: Registering service worker...");
    let swRegistration;
    try {
      swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("🔔 getFCMToken: Service worker registered:", swRegistration);
    } catch (swError) {
      console.error("🔔 getFCMToken: Service worker registration failed:", swError);
      return null;
    }

    // Request notification permission
    console.log("🔔 getFCMToken: Requesting permission...");
    const permission = await Notification.requestPermission();
    console.log("🔔 getFCMToken: Permission result:", permission);

    if (permission !== "granted") {
      console.log("🔔 getFCMToken: Notification permission denied");
      return null;
    }

    // Initialize messaging if not already done
    if (!messaging) {
      if (!app) {
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      }
      messaging = getMessaging(app);
    }

    // Get FCM token with VAPID key and service worker registration
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    console.log("🔔 getFCMToken: Getting token with VAPID key:", vapidKey ? "present" : "missing");

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration
    });
    console.log("🔔 getFCMToken: Token obtained:", token ? "success" : "failed");
    return token;
  } catch (error) {
    console.error("🔔 getFCMToken: Error:", error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (typeof window === "undefined") return null;

  try {
    if (!messaging) {
      if (!app) {
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      }
      messaging = getMessaging(app);
    }

    return onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      callback(payload);
    });
  } catch (error) {
    console.error("Error setting up foreground message listener:", error);
    return null;
  }
};

export { app, auth, googleProvider, phoneProvider, db, messaging };
