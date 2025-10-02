/**
 * @copyright 2025 lawrencem 
 * @license Apache-2.0
 */

/**
 * Node modules
 */ 
import dotenv from  "dotenv"

/**
 * Types 
 */ 
import type ms from  "ms";

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELISTED_ORIGINS: [''],
    MONGO_URL: process.env.MONGO_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue
};

export default config;