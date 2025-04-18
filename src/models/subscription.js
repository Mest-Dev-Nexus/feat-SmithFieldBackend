import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const subscriptionSchema = new Schema(
  {
    businessName: { type: Types.ObjectId },
    contactPerson: { type: Number },
    quantity: { type: Number },
    startDate: { type: Date },
    productType: {
      type: String,
      required: true,
      enum: ["vegetables", "fruits", "grains", "others"],
    },
    vegetableList: {
      type: [String],
      required: function () {
        return this.productType === "vegetables";
      },
    },
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
