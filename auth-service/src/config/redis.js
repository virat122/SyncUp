import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "RedisConfig" });

const redisConfig = {
    url: process.env.REDIS_URL || "redis://localhost:6379"
};

logger.info("Redis configuration loaded", { hasUrl: Boolean(redisConfig.url) });

export default redisConfig;
