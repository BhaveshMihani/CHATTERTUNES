import { Router } from "express";
import { generateCsvReport } from "../controller/csv.controller.js";
const router = Router();

router.get('/download', generateCsvReport);

export default router;