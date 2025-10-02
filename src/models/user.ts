/**
 * @copyright 2025 lawrencem
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Custom modules  
 */ 

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  sociallinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    linkedin?: string;
  };
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxLength: [20, "Username must be less that 20 characters"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "E-mail is required"],
      maxLength: [50, "E-mail nust be less than 50 characters"],
      unique: [true, "E-mail must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is requiered"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    firstName: {
      type: String,
      maxLength: [20, "First name  must be less than 20 characters"],
    //   required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      maxLength: [20, "Last name  must be less than 20 characters"],
    //   required: [true, "Last name is required"],
    },
    sociallinks: {
      website: {
        type: String,
        maxLength: [100, "Website address must be less than 20 characters"],
      },
      facebook: {
        type: String,
        maxLength: [
          100,
          "Facebook profile url must be less than 20 characters",
        ],
      },
      instagram: {
        type: String,
        maxLength: [
          100,
          "Instagram profile url must be less than 20 characters",
        ],
      },
      x: {
        type: String,
        maxLength: [100, "x profile url must be less than 20 characters"],
      },
      youtube: {
        type: String,
        maxLength: [100, "Youtube channel url must be less than 20 characters"],
      },
      linkedIn: {
        type: String,
        maxLength: [
          100,
          "LinkedIn profile url must be less than 20 characters",
        ],
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async  function (next){
    if(!this.isModified('password')){
        next();
        return;
    };

    // Hash the password
    this.password = await  bcrypt.hash(this.password, 10);
    next();
});

export default model<IUser>("User", userSchema);
