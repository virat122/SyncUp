import { randomUUID } from "node:crypto";
import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "RequestIdMiddleware" });

export default function requestIdMiddleware(req, res, next) {

    const log = logger.child({ operation: "assignRequestId" });
    req.requestId = randomUUID();

    res.setHeader("X-Request-Id", req.requestId);
    log.info("Request ID assigned", { requestId: req.requestId });

    next();
}
