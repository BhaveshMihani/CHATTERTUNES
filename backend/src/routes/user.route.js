import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, getAllUsersAd, getMessages } from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/allUsers", requireAdmin, protectRoute, getAllUsersAd); 
router.get("/messages/:userId", protectRoute, getMessages);

export default router;
