/**
 * @copyright 2025 lawrencem
 * @license Apache-2.0cle
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

/**
 * Custom modules
 */

import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { logger } from "@/lib/winston";
/**
 * Router
 */

import v1Routes from "@/routes/v1/index";

/**
 * Types
 * /
 */

import type { CorsOptions } from "cors";

/**
 * Exprees app initialization
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELISTED_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS error:  ${origin} is not allowed by CORS`);
    }
    // callback(new Error('CORS Error'), false);
  },
};
// apply cors middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// 'extended: true', allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable response compression to reduce payload sixe and improve performance
app.use(
  compression({
    threshold: 1024, // allow compress responses larger than 1KB
  }),
);

// Use helmet to enhance securoity by setting various HTTP headers
app.use(helmet());

//  Apply rate limmiting middleware to prevent excessive request and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 * - Tries to connect to the database before initializing the server.
 * - Defines the API toutes (`/api/v1`).
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exists with status 1.
 */
(async () => {
  try {
    await connectToDatabase();

    app.use("/api/v1", v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gratefully by disconnecting form from the database
 * - Attempts tp disconnect from the database before shutting down the  server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection,it is logged to the console.
 * - Exists the process with status code '0' (indicating a successful shutdown).
 */

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    logger.warn("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown", error);
  }
};

/**
 * Listens for termination signals ('SIGTERM' and 'SIGINT').
 * - 'SIGTERM' is typically sent when stopping a process (e.g., 'kill' command or container shutdown).
 * - 'SIGINT' is triggered when user interrupts the process (e.g., proccessing 'Ctrl + C').
 * - When either signal is received, 'handleServerdown' is executed to ensure proper cleanup.
 */

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
