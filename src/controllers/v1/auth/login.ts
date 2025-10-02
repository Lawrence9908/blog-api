/**
 * @copyright 2025 lawrencem
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { generateAccesToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";

/**
 * Moddels
 */
import User from "@/models/user";
import Token from "@/models/token";

/**
 * Types
 */

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // check if login user has profile in the database
    const user = await User.findOne({ email })
      .select("username  email password role")
      .lean()
      .exec();

    // if user is not in the database
    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    // Generate access token and refresh token for new user
    const accessToken = generateAccesToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // store refresh token in db
    await Token.create({ token: refreshToken, userId: user._id });
    logger.info("Refresh token created for user", {
      userid: user._id,
      token: refreshToken,
    });

    // add user refresh, and access token into the cookie/localstorage
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    // return response for success user creation
    res.status(201).json({
      message: "New user created",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
    logger.info("User successfully registered.",user);

  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error during user login.", error);
  }
};

export default login;
