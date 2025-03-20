import Subscription from "../models/subscription.model.js";

// Store subscription details
export const createSubscription = async (req, res) => {
    try {
        const { userId, priceId, status } = req.body;

        // Validate input
        if (!userId || !priceId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Save subscription
        const subscription = new Subscription({ userId, priceId, status });
        await subscription.save();

        res.status(201).json({ message: "Subscription created", subscription });
    } catch (error) {
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
