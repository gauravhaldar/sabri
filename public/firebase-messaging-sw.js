// Firebase Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyBq6y-XfrQAuSlFJn2dX3wpkJ8iIHLNFn0",
    authDomain: "sabri-login.firebaseapp.com",
    projectId: "sabri-login",
    storageBucket: "sabri-login.firebasestorage.app",
    messagingSenderId: "764834587540",
    appId: "1:764834587540:web:3cbc1a51fe21c3c95bfb69",
    measurementId: "G-WBC6CFQX2Q"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Sabri Jewellery';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/sabrilogo.png',
        badge: '/sabrilogo.png',
        tag: payload.data?.orderId || 'default',
        data: payload.data || {},
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View Order'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event);

    event.notification.close();

    // Get the order ID from the notification data
    const orderId = event.notification.data?.orderId;

    // Determine which URL to open
    let urlToOpen = '/profile?tab=orders';
    if (orderId) {
        urlToOpen = `/profile?tab=orders`;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
