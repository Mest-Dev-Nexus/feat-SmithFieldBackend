import { UserModel } from "../models/user.js";
import { Schema, model } from "mongoose";

const consumerSchema = new Schema({
  consumerType: {
    type: String,
    enum: ["Retail", "Wholesale"],
    required: function () {
      return this.role === "Consumer";
    },
  },
});

export const ConsumerModel = UserModel.discriminator(
  "Consumer",
  consumerSchema
);
