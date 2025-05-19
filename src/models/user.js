import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true
};

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["Administrator", "Farmer", "Consumer"],
      default: "Consumer",
      required: true,
    },

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }, 

  baseOptions);

userSchema.plugin(normalize);
export const UserModel = model("User", userSchema);
