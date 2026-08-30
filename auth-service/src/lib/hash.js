import bcrypt from "bcrypt";
import baseLogger from "./logger.js";

const logger = baseLogger.child({ component: "Hash" });
const SALT_ROUNDS = 10;

export async function hash(data) {
    const log = logger.child({ operation: "hash" });
    log.info("Hashing value");
    const valueHash = await bcrypt.hash(data, SALT_ROUNDS);
    log.info("Value hashed");
    return valueHash;
}

export async function compare(inputData, valueHash) {
    const log = logger.child({ operation: "compare" });
    log.info("Comparing hashed value");
    const matches = await bcrypt.compare(inputData, valueHash);
    log.info("Hashed value comparison completed", { matches });
    return matches;
}
