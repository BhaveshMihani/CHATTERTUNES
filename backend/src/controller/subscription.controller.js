import Subscription from "../models/subscription.model.js";

// Webhook to handle subscription creation
export const handleSubscriptionWebhook = async (req, res) => {
    try {
        console.log("Webhook received:", req.body); // Log incoming data

        const { data, event_type } = req.body;

        // Extract required fields based on event type
        let userId, priceId, status;

        if (event_type === "checkout.completed") {
            userId = data.custom_data?.userId; 
            priceId = data.subscription_id; 
            status = data.status || "pending"; // Use default status if missing
        } else if (event_type === "transaction.completed") {
            userId = data.custom_data?.userId; // Map Paddle's custom_data.userId to userId
            priceId = data.subscription_id;  // Use subscription_id as priceId
            status = "active"; // Assume active for completed transactions
        }

        // Validate extracted fields
        if (!userId || !priceId || !status) {
            console.error("Missing required fields:", { userId, priceId, status }); // Log missing fields
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Save subscription
        const subscription = new Subscription({ userId, priceId, status });
        await subscription.save();

        console.log("Subscription saved:", subscription); // Log successful save
        res.status(200).json({ message: "Subscription created successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error.message); // Log errors
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch user subscription
export const getUserSubscription = async (req, res) => {
    try {
        const { userId } = req.params;
        const subscription = await Subscription.findOne({ userId });

        if (!subscription) {
            return res.status(404).json({ message: "No subscription found" });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const checkSubscriptionStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const subscription = await Subscription.findOne({ userId, status: "active" });

        if (subscription) {
            return res.json({ isSubscribed: true });
        }

        res.json({ isSubscribed: false });
    } catch (error) {
        console.error("Error checking subscription status:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};