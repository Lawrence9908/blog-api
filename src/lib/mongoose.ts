/**
 * @copyright lawrencem
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import mongoose from "mongoose";

/**
 * Custom modules
 */
import config from "@/config";
import { logger } from "@/lib/winston";

/**
 * Types
 */

import type { ConnectOptions } from "mongoose";

/**
 * Client option
 */
const clientOptions: ConnectOptions = {
  dbName: "blog-db",
  appName: "Blog API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Established a connection to the MongoDB database using Mongoose.
 * If an errors during the connection process, it throws an error
 *  with a descriptive message.
 * - Uses  'MONGO_URI' as the connection string.
 * - 'clientOptions' contains additional configration for Mongoose.
 * - Errors are properly habdled and rethrown for better debugging.
 */

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URL) {
    throw new Error("MongoDB URI is not defined in the configuration");
  }

  try {
    const conn = await mongoose.connect(config.MONGO_URL, clientOptions);
    logger.info(`MongoDB connected, host: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error("Error connecting to the database", error);
  }
};

/**
 * Disconnects from the MongoDB database using Mongoose.
 *
 * This function attempts to disconnect from the database asynchronously/
 * If the disconnection is successful, a success message is logged.
 * If an error occurs, it is either re-thrown as a new Error  (if it's an instance of Error)
 * or logged to the console.
 */

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    logger.info("DB DISCONNECTED SUCCESSFULLY.");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    logger.error("Error disconnecting from the database", error);
  }
};
