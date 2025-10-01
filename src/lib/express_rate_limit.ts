/**
 * @copyright 2025 lawrencem
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { rateLimit } from "express-rate-limit";

// Configure rate limitting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 60000, // 1 - minute time window for request limiting
  limit: 60, // Allow a maximum of 60 requests per windows per IP
  standardHeaders: "draft-8", // Use the latest standard rate-limit headers
  legacyHeaders: false, // Disable deprecated X-RayteLimit headers
  message: {
    error:
      "You have sent too many requests in a give amount of time. Please tru again later.",
  },
});

export default limiter;
