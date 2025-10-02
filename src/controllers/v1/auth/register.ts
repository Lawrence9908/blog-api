/**
 * @copyright 2025 lawrencem 
 * @license Apache-2.0
 */

/**
 * Custom modules 
 */
import { logger } from "@/lib/winston";
import config from "@/config";
import { genUsername } from "@/utils";
import { generateAccesToken, generateRefreshToken } from "@/lib/jwt";

/**
 * Models
 */
import User from "@/models/user";
import Token from "@/models/token";

/**
 * Types
 */
import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData   = Pick<IUser, 'email' | 'password' | 'role'> 

const register  = async  (req: Request, res: Response): Promise<void> => {

    const {email, password, role} = req.body as UserData;

    try {
        
      // check if user email already exits in the database

      // get random user generated username
      const username:string = genUsername();

      // add new-user into the database
      const newUser = await User.create({
        username,
        email,
        password,
        role,
      });

      // Generate access token and refresh token for new user
      const accessToken  = generateAccesToken(newUser._id);
      const refreshToken  = generateRefreshToken(newUser._id);

      // store refresh token in db
      await Token.create({ token: refreshToken, userId: newUser._id});
      logger.info("Refresh token created for user",{
        userid: newUser._id,
        token: refreshToken
      });
      
      // add user refresh, and access token into the cookie/localstorage   
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: 'strict'
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: 'strict'
      });
       
      // return response for success user creation
      res.status(201).json({
        message:  "New user created",
        user: {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        accessToken,
        refreshToken,
      });
      logger.info("User successfully registered.", {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });
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

