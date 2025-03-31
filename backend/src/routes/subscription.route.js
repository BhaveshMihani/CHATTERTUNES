import { Router } from "express";
import { getUserSubscription, handleSubscriptionWebhook } from "../controller/subscription.controller.js";

const router = Router();

router.post("/webhook", handleSubscriptionWebhook);

// Route to get a user's subscription
router.get("/:userId", getUserSubscription);

export default router;
