import apiBase from "../../utils/apiBase.jsx";
import { useEffect, useState } from "react";

// Utility function to safely convert VAPID key for pushManager
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeUser = async (subscription, userId) => {
    try {
        const response = await fetch(`${apiBase}/notification/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                subscription,
                userId,
            }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Error al suscribirse");
        }
        return await response.json();
    } catch (error) {
        console.error("Error subscribing user:", error);
        throw error;
    }
};

export const useWebPush = (userId) => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only run on the client side
        if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);

            // Check if already subscribed
            navigator.serviceWorker.register('/sw.js').then(registration => {
                registration.pushManager.getSubscription().then(subscription => {
                    if (subscription) {
                        setIsSubscribed(true);
                    }
                });
            }).catch(err => {
                console.error("Service worker registration failed:", err);
            });
        }
    }, []);

    const subscribe = async () => {
        console.log("[WebPush] Starting subscription process...");
        setLoading(true);
        setError(null);
        try {
            // 1. Request permission
            console.log("[WebPush] Requesting permission...");
            const permission = await Notification.requestPermission();
            console.log("[WebPush] Permission result:", permission);

            if (permission !== 'granted') {
                throw new Error("Permiso de notificaciones denegado por el usuario.");
            }

            // 2. Register Service Worker
            console.log("[WebPush] Registering Service Worker...");
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log("[WebPush] SW Registered. Waiting for ready...");

            // Sometimes navigator.serviceWorker.ready can hang if SW is waiting to activate
            const readyReg = await navigator.serviceWorker.ready;
            console.log("[WebPush] SW Ready!");

            // 3. Get Public VAPID Key from backend
            console.log("[WebPush] Fetching VAPID Key from backend...");
            const keyResponse = await fetch(`${apiBase}/notification/vapidPublicKey`, {
                credentials: "include"
            });

            if (!keyResponse.ok) {
                throw new Error(`Error fetching VAPID: ${keyResponse.status}`);
            }

            const keyData = await keyResponse.json();
            console.log("[WebPush] VAPID Key received.", keyData);
            const convertedVapidKey = urlBase64ToUint8Array(keyData.publicKey);

            // 4. Subscribe to Push Manager
            console.log("[WebPush] Subscribing to push manager...");
            const subscription = await readyReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
            console.log("[WebPush] Push manager subscribed!", subscription);

            // 5. Send subscription to our backend
            console.log("[WebPush] Sending subscription to backend...");
            await subscribeUser(subscription, userId);
            console.log("[WebPush] Backend saved subscription successfully!");

            setIsSubscribed(true);
        } catch (err) {
            console.error("[WebPush] Failed to subscribe:", err);
            setError(err.message);
        } finally {
            console.log("[WebPush] Subscription process finished, turning off loading.");
            setLoading(false);
        }
    };

    const sendTestNotification = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiBase}/notification/sendToUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId: userId,
                    title: "¡Notificación de Prueba!",
                    message: "Si estás viendo esto, las notificaciones push funcionan correctamente."
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send test notification");
            }
            console.log("[WebPush] Test notification triggered.");
        } catch (err) {
            console.error("[WebPush] Error triggering test notification:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { isSupported, isSubscribed, loading, error, subscribe, sendTestNotification };
};