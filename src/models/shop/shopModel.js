import mongoose from "mongoose";
import normalize from "normalize-mongoose/index.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    availability: { type: Boolean, required: true },
    image: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 0 },
    deleted: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Administrator", required: true },
  },
  { timestamps: true }
);

productSchema.plugin(normalize);

export const ProductModel = mongoose.model("Product", productSchema);