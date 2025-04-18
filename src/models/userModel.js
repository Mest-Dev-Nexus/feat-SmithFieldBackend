import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose/index.js";


const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
   
    role: {
      type: String,
      default: "Consumer",
      enum: ["Administrator", "Farmer", "Consumer"],
    },
    consumerType: {
      type: String,
      default: "normalConsumer",
      enum: ['normalConsumer', 'Food Processor', 'Bulk Buyer'],
      required: function() {
        return this.role === "Consumer";
      }
    },
  },
  { timestamps: true }
);

userSchema.plugin(normalize);
export const UserModel = model("Administrator", userSchema);
