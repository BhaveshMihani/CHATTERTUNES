import Subscription from "../models/subscription.model.js";
export const handleSubscriptionWebhook = async (req, res) => {
    try {
        const { subData } = req.body;

        const { userId, priceId, status } = subData;

        if (!userId || !priceId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingSubscription = await Subscription.findOne({ userId, priceId });
        if (existingSubscription) {
            return res.status(200).json({ message: "Subscription already exists", subscription: existingSubscription });
        }

        const subscription = new Subscription(subData);
        await subscription.save();

        res.status(200).json({ message: "Subscription created successfully", subscription });
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

        res.status(200).json({ subscription });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};