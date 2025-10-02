/**
 * @copyright lawrencem
 * @license Apache-2.0
 */

/**
 * Node modules
 */

import winston from "winston";

/**
 * Custom modules
 */
import config from "@/config";
const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

//Define the transport array to hold doifferent logging transport
const transports: winston.transport[] = [];

// If the application is not running in production, add a console transport
if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // all colors to log
        timestamp({ format: "YYYY-MM-DD hh:mm:ss " }), // Add timestamp to logs
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";
          return `${timestamp} [${level}] : ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// create a logger instance using Winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()), // Use JSON format for log messages
  transports,
  silent: config.NODE_ENV === "test", // Disable logging in test environment
});

export  {logger};
