import prisma from "../database/prisma.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "OtpModel" });

export async function create(data) {
    const log = logger.child({ operation: "create", userId: data.userId });
    log.info("Creating OTP");
    const otp = await prisma.otp.create({ data });
    log.info("OTP created", { otpId: otp.id });
    return otp;
}

export async function findActiveOtp(userId, purpose) {
    const log = logger.child({ operation: "findActiveOtp", userId, purpose });
    log.info("Finding active OTP");
    const otp = await prisma.otp.findFirst({
        where: {
            userId,
            purpose,
            consumed: false,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
    });
    log.info("Active OTP lookup completed", { found: Boolean(otp) });
    return otp;
}

export async function incrementAttempts(id) {
    const log = logger.child({ operation: "incrementAttempts", otpId: id });
    log.info("Incrementing OTP attempts");
    const otp = await prisma.otp.update({
        where: { id },
        data: { attempts: { increment: 1 } }
    });
    log.info("OTP attempts incremented", { attempts: otp.attempts });
    return otp;
}

export async function markConsumed(id) {
    const log = logger.child({ operation: "markConsumed", otpId: id });
    log.info("Marking OTP as consumed");
    const otp = await prisma.otp.update({
        where: { id },
        data: { consumed: true }
    });
    log.info("OTP marked as consumed");
    return otp;
}
