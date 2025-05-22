import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const subscriptionSchema = new Schema(
  {
    name: { type: Types.ObjectId, required: true, ref: "Customer" }, // assuming reference
    contactPerson: { type: Number, required: true },
    startDate: { type: Date, required: true },
    products: [
      {
        product: { type: Types.ObjectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Mobile Money", "Bank Transfer"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

subscriptionSchema.plugin(normalize);
export const SubscriptionModel = model("Subscription", subscriptionSchema);
