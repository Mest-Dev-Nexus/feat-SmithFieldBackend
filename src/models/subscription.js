import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const subscriptionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },

    contactPerson: { type: Number, required: true },
    startDate: { type: Date, required: true },

    packageType: {
      type: String,
      enum: ["predefined", "custom"],
      required: true
    },
    
    selectedPackage: {
      type: String,
      enum: ["Family Essentials", "Healthy Living", "Quick Meals"],
      required: function () {
        return this.packageType === "predefined";
      }
    },
    products: [
      {
        product: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number }
      }
    ],

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Mobile Money", "Bank Transfer"],
      default: "Cash"
    }
  },
  { timestamps: true }
);
subscriptionSchema.plugin(normalize);
export const SubscriptionModel = model("Subscription", subscriptionSchema);
