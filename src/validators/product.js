import Joi from "joi";

export const addProductValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  image: Joi.string().required(),
  source: Joi.string(),
  category: Joi.string().required(),
  shopType: Joi.string().required(),
  quantity: Joi.string().min(0).required(),
  availability: Joi.boolean().required(),
});


export const replaceProductValidator = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  quantity: Joi.number().required(),
});