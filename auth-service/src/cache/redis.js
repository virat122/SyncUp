import { createClient } from "redis";
import env from "../config/env.js";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "RedisCache" });
const memoryStore = new Map();
let client = null;
let mode = "memory";

async function ensureClient() {
    const log = logger.child({ operation: "ensureClient" });
    if (client) {
        return client;
    }

    try {
        client = createClient({ url: env.redisUrl });
        client.on("error", (error) => {
            logger.warn("Redis client error", { error: error.message });
        });
        await client.connect();
        mode = "redis";
        log.info("Connected to Redis");
        return client;
    } catch (error) {
        log.warn("Redis unavailable; using in-memory cache", { error: error.message });
        mode = "memory";
        return null;
    }
}

async function setValue(key, value, ttlSeconds = 600) {
    const log = logger.child({ operation: "set", cacheMode: mode });
    await ensureClient();

    if (mode === "redis" && client) {
        await client.set(key, value, { EX: ttlSeconds });
        log.info("Cache value stored in Redis", { ttlSeconds });
        return true;
    }

    memoryStore.set(key, value);
    if (ttlSeconds > 0) {
        setTimeout(() => memoryStore.delete(key), ttlSeconds * 1000);
    }
    log.info("Cache value stored in memory", { ttlSeconds });
    return true;
}

async function getValue(key) {
    const log = logger.child({ operation: "get", cacheMode: mode });
    await ensureClient();

    if (mode === "redis" && client) {
        const value = await client.get(key);
        log.info("Cache lookup completed", { found: value !== null });
        return value;
    }

    const value = memoryStore.get(key) ?? null;
    log.info("Cache lookup completed", { found: value !== null });
    return value;
}

async function deleteValue(key) {
    const log = logger.child({ operation: "delete", cacheMode: mode });
    await ensureClient();

    if (mode === "redis" && client) {
        await client.del(key);
        log.info("Cache value deleted from Redis");
        return true;
    }

    memoryStore.delete(key);
    log.info("Cache value deleted from memory");
    return true;
}

export { setValue, getValue, deleteValue };
export default {
    set: setValue,
    get: getValue,
    del: deleteValue
};
