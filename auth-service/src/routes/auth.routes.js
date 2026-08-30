import { Router } from "express";

import * as AuthController from "../controllers/auth.controller.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "AuthRoutes" });
const router = Router();

logger.info("Registering authentication routes");

router.post("/register", AuthController.register);
router.post("/register/verify", AuthController.verifyRegistrationOtp);

router.post("/login", AuthController.login);

export default router;
