import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
import requestIdMiddleware from "./middleware/requestId.middleware.js";
import baseLogger from "./lib/logger.js";

const logger = baseLogger.child({ component: "AppFile" });

const app = express();

logger.info("Configuring Express application");

app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(requestIdMiddleware);
app.use((req, res, next) => {
    const startedAt = Date.now();
    const log = logger.child({ operation: "request", requestId: req.requestId });
    log.info("Incoming request", { method: req.method, path: req.originalUrl });
    res.on("finish", () => {
        log.info("Request completed", {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt
        });
    });
    next();
});

app.use("/api/v1", routes);

app.use(errorHandler);

logger.info("Express application configured");

export default app;
