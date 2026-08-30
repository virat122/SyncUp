import baseLogger from "../lib/logger.js";
import { ApiError } from "../errors/index.js";

const logger = baseLogger.child({
    component: "ErrorHandler"
});

export default function errorHandler(err, req, res, next) {
    const log = logger.child({
        operation: "errorHandler",
        requestId: req.requestId
    });

    log.info("Error handler started");

    log.error("Request error occurred", {
        errorName: err.name,
        errorMessage: err.message,
        errorCode: err.errorCode ?? null,
        statusCode: err.statusCode ?? 500,
        method: req.method,
        path: req.originalUrl,
        stack: err.stack
    });

    if (err instanceof ApiError) {
        log.warn("Handled application error", {
            statusCode: err.statusCode,
            errorCode: err.errorCode
        });

        log.info("Error handler ended");

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            requestId: req.requestId
        });
    }

    log.error("Unhandled internal server error", {
        statusCode: 500,
        stack: err.stack
    });

    log.info("Error handler ended");

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        requestId: req.requestId
    });
}
