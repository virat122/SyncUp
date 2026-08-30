import jwt from "jsonwebtoken";
import env from "../config/env.js";
import baseLogger from "./logger.js";

const logger = baseLogger.child({ component: "Jwt" });
const ACCESS_TOKEN_EXPIRES_IN = env.jwtExpiresIn;
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function generateAccessToken(payload) {
    const log = logger.child({ operation: "generateAccessToken" });
    log.info("Generating access token");
    const token = jwt.sign(payload, env.jwtSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    log.info("Access token generated");
    return token;
}

export function generateRefreshToken(payload) {
    const log = logger.child({ operation: "generateRefreshToken" });
    log.info("Generating refresh token");
    const token = jwt.sign(payload, env.jwtSecret, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    log.info("Refresh token generated");
    return token;
}

export function verifyAccessToken(token) {
    const log = logger.child({ operation: "verifyAccessToken" });
    log.info("Verifying access token");
    const payload = jwt.verify(token, env.jwtSecret);
    log.info("Access token verified");
    return payload;
}

export function verifyRefreshToken(token) {
    const log = logger.child({ operation: "verifyRefreshToken" });
    log.info("Verifying refresh token");
    const payload = jwt.verify(token, env.jwtSecret);
    log.info("Refresh token verified");
    return payload;
}
