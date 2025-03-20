import { Router } from "express";
import { createSubscription, getUserSubscription } from "../controller/subscription.controller.js";

const router = Router();

// Route to create a subscription
router.post("/", createSubscription);

// Route to get a user's subscription
router.get("/:userId", getUserSubscription);

export default router;
