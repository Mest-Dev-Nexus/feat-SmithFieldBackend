import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose/index.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    shopType: { type: String, enum: ['retail', 'wholesale', 'farm-input'], required: true },
  },
  { timestamps: true }
);

categorySchema.plugin(normalize);

export const CategoryModel = model("Category", categorySchema);
