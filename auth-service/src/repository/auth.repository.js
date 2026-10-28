import prisma from "../database/prisma.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "AuthModel" });

export async function findByEmail(email) {
    const log = logger.child({ operation: "findByEmail" });
    log.info("Finding user by email");
    const user = await prisma.userAuth.findUnique({
        where: {
            email
        }
    });
    log.info("Finished finding user by email", { found: Boolean(user) });
    return user;
}

export async function findByPhone(phone) {
    const log = logger.child({ operation: "findByPhone" });
    log.info("Finding user by phone");
    const user = await prisma.userAuth.findUnique({
        where: {
            phone
        }
    });
    log.info("Finished finding user by phone", { found: Boolean(user) });
    return user;
}

export async function createUser(data) {
    const log = logger.child({ operation: "createUser" });
    log.info("Creating user", { status: data.status });
    const user = await prisma.userAuth.create({
        data
    });
    log.info("User created", { userId: user.id, status: user.status });
    return user;
}

export async function createUserWithOtp(userData, otpData) {
    const log = logger.child({ operation: "createUserWithOtp" });
    log.info("Creating pending user and registration OTP");

    const user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.userAuth.create({ data: userData });
        await tx.otp.create({
            data: {
                ...otpData,
                userId: createdUser.id
            }
        });
        return createdUser;
    });

    log.info("Pending user and registration OTP created", { userId: user.id });
    return user;
}

export async function findById(id) {
    const log = logger.child({ operation: "findById", userId: id });
    log.info("Finding user by ID");
    const user = await prisma.userAuth.findUnique({
        where: { id }
    });
    log.info("Finished finding user by ID", { found: Boolean(user) });
    return user;
}

export async function updateUser(id, data) {
    const log = logger.child({ operation: "updateUser", userId: id });
    log.info("Updating user", { status: data.status });
    const user = await prisma.userAuth.update({
        where: { id },
        data
    });
    log.info("User updated", { status: user.status });
    return user;
}

export async function activateUserAndConsumeOtp(userId, otpId, userData) {
    const log = logger.child({ operation: "activateUserAndConsumeOtp", userId, otpId });
    log.info("Activating user and consuming OTP");

    const user = await prisma.$transaction(async (tx) => {
        await tx.otp.update({
            where: { id: otpId },
            data: { consumed: true }
        });
        return tx.userAuth.update({
            where: { id: userId },
            data: userData
        });
    });

    log.info("User activated and OTP consumed");
    return user;
}

export async function createOtp(data) {
    const log = logger.child({ operation: "createOtp", userId: data.userId });
    log.info("Creating OTP", { channel: data.channel, purpose: data.purpose });
    const otp = await prisma.otp.create({
        data
    });
    log.info("OTP created", { otpId: otp.id });
    return otp;
}

export async function findLatestOtpByUserId(userId) {
    const log = logger.child({ operation: "findLatestOtpByUserId", userId });
    log.info("Finding latest registration OTP");
    const otp = await prisma.otp.findFirst({
        where: {
            userId,
            purpose: "REGISTER"
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    log.info("Finished finding latest registration OTP", { found: Boolean(otp) });
    return otp;
}

export async function markOtpConsumed(id) {
    const log = logger.child({ operation: "markOtpConsumed", otpId: id });
    log.info("Marking OTP as consumed");
    const otp = await prisma.otp.update({
        where: {
            id
        },
        data: {
            consumed: true
        }
    });
    log.info("OTP marked as consumed");
    return otp;
}
