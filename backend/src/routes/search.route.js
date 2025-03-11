import { Router } from "express";
import { searchSongs } from "../controller/search.controller.js";

const router = Router();

// Define the search route
router.get('/', (req, res, next) => {
    console.log("Search route handler accessed");
    next();
}, searchSongs);

export default router;