import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ "component": "ApiError" });

class ApiError extends Error {
    constructor(statusCode, message, errorCode = null) {
        super(message);

        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = this.constructor.name;

        const log = logger.child({
            operation: "constructor",
            statusCode,
            errorCode,
        });

        log.debug("ApiError created", { message });
        
        Error.captureStackTrace(this, this.constructor);
    }

}

export default ApiError;
