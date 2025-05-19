import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const discountSchema = new Schema(
  {
    promocode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

discountSchema.plugin(normalize);

export const DiscountModel = model("Discount", discountSchema);
