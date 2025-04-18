import Joi from "joi";
import mongoose from "mongoose";

export const validateProduct = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  availability: Joi.boolean().required(),
  image: Joi.string().uri().required(),
  source: Joi.string().required(),
  category: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid category ID");
    }
    return value;
  }).required(),
  consumer: Joi.string().valid("farmer", "user").default("user"),
  quantity: Joi.number().min(0).required(),
  userId: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message("Invalid user ID");
    }
    return value;
  }).required(),
});

