import express from "express";
import webpush from "web-push";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscriptionsFilePath = path.join(__dirname, "..", "subscriptions.json");

// Define VAPID keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

// Initialize web-push
webpush.setVapidDetails(
    vapidSubject,
    publicVapidKey,
    privateVapidKey
);

// Helper function to read subscriptions
const getSubscriptions = () => {
    try {
        const data = fs.readFileSync(subscriptionsFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("Error reading subscriptions:", error);
        return [];
    }
};

// Helper function to save subscriptions
const saveSubscriptions = (subscriptions) => {
    try {
        fs.writeFileSync(subscriptionsFilePath, JSON.stringify(subscriptions, null, 2));
    } catch (error) {
        console.error("Error saving subscriptions:", error);
    }
};

// Route to serve the public key to the frontend
router.get("/vapidPublicKey", (req, res) => {
    res.json({ publicKey: publicVapidKey });
});

// Route to save a new subscription
router.post("/subscribe", (req, res) => {
    // Support frontend sending { subscription: {...}, userId: '123' } 
    // OR sending the raw subscription object with a userId property attached.
    const subObj = req.body.subscription || req.body;
    const uid = req.body.userId || subObj.userId;
    console.log("Received subscription request for User ID:", uid);

    if (!subObj || !subObj.endpoint) {
        return res.status(400).json({ error: "Invalid subscription object" });
    }

    const subscriptions = getSubscriptions();

    // Check if subscription already exists based on endpoint
    const existingIndex = subscriptions.findIndex((sub) => sub.endpoint === subObj.endpoint);

    if (existingIndex === -1) {
        // Save the raw subscription data plus the userId
        subscriptions.push({ ...subObj, userId: uid });
        saveSubscriptions(subscriptions);
        console.log("New subscription added:", subObj.endpoint, "- User ID:", uid || 'None');
    } else {
        // If it exists but the User ID changed (e.g. user logged in on same browser), update it
        if (subscriptions[existingIndex].userId !== uid) {
            subscriptions[existingIndex].userId = uid;
            saveSubscriptions(subscriptions);
            console.log("Updated User ID for existing subscription:", subObj.endpoint);
        } else {
            console.log("Subscription already exists:", subObj.endpoint);
        }
    }

    res.status(201).json({ message: "Subscription saved successfully." });
});

// Route to test sending a notification to all subscribers
router.post("/sendTestNotification", async (req, res) => {
    const { title, message } = req.body;

    const payload = JSON.stringify({
        title: title || "Test Notification",
        body: message || "This is a test web push notification from the backend!"
    });

    const subscriptions = getSubscriptions();

    if (subscriptions.length === 0) {
        return res.status(404).json({ error: "No subscriptions found" });
    }

    const errors = [];
    const successful = [];

    // Send the push notification to each subscription
    const promises = subscriptions.map((subscription) => {
        return webpush.sendNotification(subscription, payload)
            .then(() => successful.push(subscription.endpoint))
            .catch((err) => {
                console.error("Error sending notification, removing subscription:", err);
                errors.push(subscription.endpoint);
                // Optionally: You can filter out invalid subscriptions here and re-save
            });
    });

    await Promise.all(promises);

    // If there were errors (like expired subscriptions), we should remove them
    if (errors.length > 0) {
        const validSubscriptions = subscriptions.filter(sub => !errors.includes(sub.endpoint));
        saveSubscriptions(validSubscriptions);
    }

    res.status(200).json({
        message: "Test notifications sent.",
        successfulCount: successful.length,
        failedCount: errors.length
    });
});

// Route to send a notification to a specific user
router.post("/sendToUser", async (req, res) => {
    const { userId, title, message } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "userId is required to send a targeted notification." });
    }

    const payload = JSON.stringify({
        title: title || "New Notification",
        body: message || "You have a new message!"
    });

    const subscriptions = getSubscriptions();

    // Filter subscriptions for the specific user
    const userSubscriptions = subscriptions.filter(sub => sub.userId === userId);

    if (userSubscriptions.length === 0) {
        return res.status(404).json({ error: "No active subscriptions found for this user." });
    }

    const errors = [];
    const successful = [];

    const promises = userSubscriptions.map((subscription) => {
        return webpush.sendNotification(subscription, payload)
            .then(() => successful.push(subscription.endpoint))
            .catch((err) => {
                console.error("Error sending notification, removing subscription:", err);
                errors.push(subscription.endpoint);
            });
    });

    await Promise.all(promises);

    // Clean up invalid subscriptions for this user
    if (errors.length > 0) {
        const validSubscriptions = subscriptions.filter(sub => !errors.includes(sub.endpoint));
        saveSubscriptions(validSubscriptions);
    }

    res.status(200).json({
        message: `Notifications sent to user ${userId}.`,
        successfulCount: successful.length,
        failedCount: errors.length
    });
});

export default router;