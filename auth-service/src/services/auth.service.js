import * as AuthModel from "../models/auth.model.js";
import * as OtpService from "../services/otp.service.js";
import baseLogger from "../lib/logger.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../errors/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { hash, compare } from "../lib/hash.js";
import { generateAccessToken } from "../lib/jwt.js";

const logger = baseLogger.child({ "component": "AuthService" });

function getDeps(deps = {}) {
    return {
        authModel: deps.authModel || AuthModel,
        otpService: deps.otpService || OtpService
    };
}

export async function register(body, deps = {}) {
    const log = logger.child({ "operation": "register" });
    log.info("Register function started");

    const { authModel, otpService } = getDeps(deps);

    if (!body?.email && !body?.phone) {
        throw new BadRequestError("Email or phone is required");
    }
    if (!body?.password) {
        throw new BadRequestError("Password is required");
    }
    
    const channel = getOtpChannel(body.channel, body);

    const existing = body?.email
        ? await authModel.findByEmail(body.email)
        : null;
    const existingPhone = body?.phone
        ? await authModel.findByPhone(body.phone)
        : null;

    log.info("Register function checked for existing account");

    if (existing || existingPhone) {
        log.warn("Register function user already exists");
        throw new ConflictError("Email or phone already registered", ERROR_CODES.AUTH_SERVICE_REGISTER_EMAIL_ALREADY_REGISTERED1);
    }

    const passwordHash = await hash(body.password);
    const otpCode = otpService.generateOtpCode();
    const otpHash = await otpService.hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    let user;
    try {
        user = await authModel.createUserWithOtp({
            email: body.email || null,
            phone: body.phone || null,
            passwordHash,
            provider: "LOCAL",
            status: "PENDING_VERIFICATION",
            isActive: false,
            isEmailVerified: false,
            isPhoneVerified: false
        }, {
            codeHash: otpHash,
            channel,
            purpose: "REGISTER",
            expiresAt
        });
    } catch (error) {
        if (error?.code === "P2002") {
            log.warn("Register function lost a uniqueness race");
            throw new ConflictError("Email or phone already registered", ERROR_CODES.AUTH_SERVICE_REGISTER_EMAIL_ALREADY_REGISTERED1);
        }
        throw error;
    }

    await otpService.sendOtp({
        channel,
        destination: channel === "SMS" ? user.phone : user.email,
        code: otpCode
    });

    log.info("Register function pending user and OTP stored successfully", { userId: user.id });
    log.info("Register function ended");

    return {
        userId: user.id,
        expiresAt,
        otpSent: true
    };
}

export async function verifyRegistrationOtp(body, deps = {}) {
    const log = logger.child({ "operation": "verifyRegistrationOtp" });
    log.info("Verify registration OTP function started");

    const { authModel, otpService } = getDeps(deps);

    if (!body?.userId || !body?.otpCode) {
        throw new BadRequestError("userId and otpCode are required");
    }

    const user = await authModel.findById(body.userId);
    if (!user) {
        throw new BadRequestError("User not found");
    }

    if (user.status !== "PENDING_VERIFICATION") {
        throw new BadRequestError("User is already verified");
    }

    const otp = await authModel.findLatestOtpByUserId(body.userId);

    if (!otp || otp.consumed || new Date(otp.expiresAt) < new Date()) {
        throw new BadRequestError("OTP expired or already used");
    }

    const isValidOtp = await otpService.verifyOtp(body.otpCode, otp.codeHash);

    if (!isValidOtp) {
        throw new BadRequestError("Invalid OTP");
    }

    const verifiedUser = await authModel.activateUserAndConsumeOtp(
        body.userId,
        otp.id,
        {
            status: "ACTIVE",
            isActive: true,
            isEmailVerified: Boolean(user.email),
            isPhoneVerified: Boolean(user.phone)
        }
    );

    log.info("Verify registration OTP function completed successfully");
    return {
        user: verifiedUser
    };
}

function getOtpChannel(requestedChannel, { email, phone }) {
    if (requestedChannel) {
        const channel = requestedChannel.toUpperCase();
        if (channel !== "EMAIL" && channel !== "SMS") {
            throw new BadRequestError("channel must be EMAIL or SMS");
        }
        if (channel === "EMAIL" && !email) {
            throw new BadRequestError("Email is required for EMAIL OTP delivery");
        }
        if (channel === "SMS" && !phone) {
            throw new BadRequestError("Phone is required for SMS OTP delivery");
        }
        return channel;
    }

    return email ? "EMAIL" : "SMS";
}

export async function login(body) {
    const log = logger.child({ "operation": "login" });
    log.info("Login function started");

    if (!body?.email || !body?.password) {
        throw new BadRequestError("Email and password are required");
    }

    const user = await AuthModel.findByEmail(body.email);
    log.info("Login function checked for email exists");

    if (!user) {
        log.warn("Login function invalid credentials", { email: body.email });
        throw new UnauthorizedError("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS);
    }
    if (user.status !== "ACTIVE" || !user.isActive || !user.passwordHash) {
        throw new UnauthorizedError("Please verify your account before logging in");
    }

    const matched = await compare(body.password, user.passwordHash);

    if (!matched) {
        log.warn("Login function invalid credentials", { email: body.email });
        throw new UnauthorizedError("Invalid email or password");

    }
    const token = generateAccessToken({ id: user.id });
    log.info("Login function token generated successfully");


    log.info("Login function ended");
    return { accessToken: token };

}
