import { Router } from "express";
import { getUserSubscription, handleSubscriptionWebhook,checkSubscriptionStatus } from "../controller/subscription.controller.js";

const router = Router();

router.post("/webhook", handleSubscriptionWebhook);

router.get("/status/:userId", checkSubscriptionStatus);

// Route to get a user's subscription
router.get("/:userId", getUserSubscription);

export default router;
