import dotenv from "dotenv";
import { ConfigurationError } from "../errors/index.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "EnvironmentConfig" });
dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 4001,

    databaseUrl: process.env.DATABASE_URL,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",

    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

    kafkaClientId:
        process.env.KAFKA_CLIENT_ID || "auth-service",

    kafkaBrokers:
        (process.env.KAFKA_BROKERS || "localhost:9092")
            .split(",")
};

if (!env.databaseUrl) {
    throw new ConfigurationError(
        "DATABASE_URL is required",
        "CONFIG-DB-001"
    );
}

if (!env.jwtSecret) {
    throw new ConfigurationError(
        "JWT_SECRET is required",
        "CONFIG-JWT-001"
    );
}

export default env;

logger.info("Environment configuration loaded", {
    nodeEnv: env.nodeEnv,
    port: env.port,
    hasDatabaseUrl: Boolean(env.databaseUrl),
    hasJwtSecret: Boolean(env.jwtSecret)
});
