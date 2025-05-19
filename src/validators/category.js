import Joi from "joi";

export const categoryValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  shopType: Joi.string().valid('retail', 'wholesale', 'farm-input')
});
