/**
 * @copyright 2025 lawrencem 
 * @license Apache-2.0
 */

/**
 * Node modules 
 */ 
 import { Schema, model, Types } from "mongoose"; 

 interface IToken {
    token: String,
    userId: Types.ObjectId
 };

 const tokenSchema  = new Schema<IToken>({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
 });

 export default model<IToken>('Token', tokenSchema);