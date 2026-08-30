import { Router } from "express";

import authRoutes from "./auth.routes.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "Routes" });
const router = Router();

router.use("/auth", authRoutes);
logger.info("Application routes registered");

export default router;
