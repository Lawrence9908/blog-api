/**
 * @copyright lawrencem
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcryptjs";

/**
 * Controllers
 */
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh_token";

/**
 * Middlewares
 */
import ValidationError from "@/middlewares/validationError";
/**
 *  Models
 */
import User from "@/models/user";

const router = Router();

router.post(
  "/register",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is required")
    .isLength({ max: 50 })
    .withMessage("E-mail must be less that 50 characters")
    .isEmail()
    .withMessage("Invalid emaill address")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error("User email already exists.");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin ot user"),
  ValidationError,
  register,
);

router.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is required")
    .isLength({ max: 50 })
    .withMessage("E-mail must be less that 50 characters")
    .isEmail()
    .withMessage("Invalid emaill address")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error("Invalid username or password.");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email: email })
        .select("password")
        .lean()
        .exec();

      if (!user) {
        throw new Error("User email or password is invalid");
      }

      const passwordMatch = await bcrypt.compare(value, user.password);
      if (!passwordMatch) {
        throw new Error("User email or password is invalid");
      }
    }),
  ValidationError,
  login,
);

router.post(
  "/refresh-token",
  cookie("refreshToken")
  .notEmpty()
  .withMessage("Refresh token is required")
  .isJWT()
  .withMessage("Invalid refresh token"),
  ValidationError,
  refreshToken,
);

export default router;
