/**
 * @copyright 2025 lawrencem 
 * @license Apache-2.0
 */

/**
 * Custom modules 
 */
import { logger } from "@/lib/winston";
import config from "@/config";

/**
 * Models
 */

/**
 * Types
 */
import type { Request, Response } from "express";

const register  = async  (req: Request, res: Response): Promise<void> => {
    try {
      res.status(201).json({
        message:  "New user created"
      });
      logger.info("User successfully registered.")
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
            error: error
        });
        logger.error("Error during user registration.", error);
    };
};

export default register;

