import baseLogger from "../lib/logger.js";

const logger = baseLogger.child({ component: "Response" });

export const successResponse = (res,data = {},message = "Success",statusCode = 200) => {
    logger.info("Sending success response", { statusCode, message });
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res,message = "Internal Server Error",statusCode = 500) => {
    logger.error("Sending error response", { statusCode, message });
    return res.status(statusCode).json({
        success: false,
        message
    });
};
