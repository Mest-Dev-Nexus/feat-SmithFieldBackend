import mongoose from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    //authorization
    role: {
      type: String,
      default: "user",
      enum: ["Administrator", "Farmer", "user", "staff"],
    },
  },
  { timeStamps: true }
);

userSchema.plugin(normalize);
export const UserModel = model("User", userSchema);
