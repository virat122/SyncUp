import crypto from "node:crypto";
import { hash, compare } from "../lib/hash.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "OtpService" });

export function generateOtpCode(length = 6) {
    const log = logger.child({ operation: "generateOtpCode" });
    log.info("Generating OTP", { length });
    const minimum = 10 ** (length - 1);
    const maximum = 10 ** length;
    const code = crypto.randomInt(minimum, maximum).toString();
    log.info("OTP generated");
    return code;
}

export async function hashOtp(code) {
    const log = logger.child({ operation: "hashOtp" });
    log.info("Hashing OTP");
    const codeHash = await hash(code);
    log.info("OTP hashed");
    return codeHash;
}

export async function verifyOtp(inputCode, storedHash) {
    const log = logger.child({ operation: "verifyOtp" });
    log.info("Verifying OTP");
    const isValid = await compare(inputCode, storedHash);
    log.info("OTP verification completed", { isValid });
    return isValid;
}

export async function sendOtp({ channel, destination, code }) {
    const log = logger.child({ operation: "sendOtp", channel });
    if (!destination) {
        log.error("OTP delivery failed: missing destination");
        throw new Error("OTP destination is required");
    }

    // This is a development transport until a mail/SMS provider is configured.
    // Never log the OTP itself: logs are often retained and broadly accessible.
    log.info("Registration OTP delivery requested");
    return { delivered: true, channel };
}
