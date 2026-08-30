import { PrismaClient } from "@prisma/client";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "Prisma" });
const prisma = new PrismaClient();

prisma.$on("error", (event) => {
    logger.error("Prisma client error", { message: event.message });
});

logger.info("Prisma client initialized");

export default prisma;
