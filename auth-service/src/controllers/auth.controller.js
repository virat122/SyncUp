import * as AuthService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";
import logger from "../lib/logger.js";

const baseLogger = logger.child({ "component": "AuthController" });
export async function register(req, res, next) {
    const log = baseLogger.child({ "operation": "register" });
    try {
        log.info("Register function started");

        const result = await AuthService.register(req.body);
        log.info("Register function AuthService completed successfully");

        log.info("Register function ended");
        successResponse(res, result, "OTP sent for registration", 201);

    } catch (err) {
        log.error("Register function failed", { error: err.message });
        next(err);
    }

}

export async function verifyRegistrationOtp(req, res, next) {
    const log = baseLogger.child({ "operation": "verifyRegistrationOtp" });
    try {
        log.info("Verify registration OTP function started");

        const result = await AuthService.verifyRegistrationOtp(req.body);
        log.info("Verify registration OTP function completed successfully");

        successResponse(res, result, "Registration completed successfully", 200);
    } catch (err) {
        log.error("Verify registration OTP function failed", { error: err.message });
        next(err);
    }
}

export async function login(req, res, next) {
    const log = baseLogger.child({ "operation": "login" });
    try {
        log.info("Login function started");

        const result = await AuthService.login(req.body);
        log.info("Login function AuthService completed successfully");

        log.info("Login function ended");
        successResponse(res, result, "User logged in successfully", 200);

    } catch (err) {
        log.error("Login function failed", { error: err.message });
        next(err);

    }

}