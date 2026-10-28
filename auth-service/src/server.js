import { pathToFileURL } from 'node:url';
import path from 'node:path';
import app from './app.js';
import env from './config/env.js';
import baseLogger from "./lib/logger.js";

const logger = baseLogger.child({ component: "ServerFile" });

export function startServer(port = env.port, host = '0.0.0.0', maxAttempts = 10) {
    return new Promise((resolve, reject) => {
        const tryListen = (currentPort, attempt) => {
            const server = app.listen(currentPort, host, () => {
                logger.info("Server started", { host, port: currentPort });
                resolve(server);
            });

            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE' && attempt < maxAttempts) {
                    logger.warn("Port is already in use; retrying", {
                        port: currentPort,
                        nextPort: currentPort + 1
                    });
                    tryListen(currentPort + 1, attempt + 1);
                    return;
                }

                logger.error("Server failed to start", { error: error.message, port: currentPort });
                reject(error);
            });
        };

        tryListen(port, 1);
    });
}

const isMainModule = process.argv[1]
    ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
    : false;

if (isMainModule) {
    startServer().catch((error) => {
        logger.error("Server process failed", { error: error.message, stack: error.stack });
        process.exit(1);
    });
}
