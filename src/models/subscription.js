import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const subscriptionSchema = new Schema(
  {
    name: { type: Types.ObjectId },
    contactPerson: { type: Number },
    startDate: { type: Date },
    products: [{ product: {type: Types.ObjectId}, quantity: {type: Number} }],
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Mobile Money", "Bank Transfer"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

subscriptionSchema.plugin(normalize);
export const subscriptonModel = model("Subscription", subscriptionSchema);
