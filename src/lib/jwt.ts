/**
 * @copyright 2025 lawrencem 
 * @license Apache-2.0
 */ 

/**
 * Node modules 
 */

import jwt from "jsonwebtoken";

/**
 * Custom modules 
 */
import config from "@/config";


/**
 * Types 
 */
 import { Types } from "mongoose";

 export const generateAccesToken = (userId: Types.ObjectId): string =>{
    return  jwt.sign({userId}, config.JWT_ACCESS_SECRET,{
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi',
    });
 };

export const generateRefreshToken = (userId: Types.ObjectId): string =>{
    return  jwt.sign({userId}, config.JWT_REFRESH_SECRET,{
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'accessApi',
    });
 };

 export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
 };

  export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
 };