import { Router } from "express";

import * as AuthController from "../controllers/auth.controller.js";
import baseLogger from "../lib/logger.js";
import { validateRequest } from "../middleware/requestValidation.middleware.js";

import {
  registerSchema,
  verifyRegistrationOtpSchema,
  loginSchema
} from "../validators/auth.validation.js";

const logger = baseLogger.child({
  component: "AuthRoutes"
});

const router = Router();

logger.info("Registering authentication routes");

router.post("/register",
  validateRequest(registerSchema),
  AuthController.register
);

router.post(
  "/register/verify",
  validateRequest(verifyRegistrationOtpSchema),
  AuthController.verifyRegistrationOtp
);

router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.login
);

export default router;