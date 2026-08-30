import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            winston.format.errors({ stack: true }),

            winston.format.printf((info) => {

                const { timestamp, level, message, stack, ...meta } = info;

                return `${timestamp} ${level}: ${stack || message} ${JSON.stringify(meta)}`;

            })
        ),

    defaultMeta: {
        service: "auth-service"
    },

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),
        new winston.transports.File({
            filename: "logs/combined.log"
        })
    ]
});

export default logger;



