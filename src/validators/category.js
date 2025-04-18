import Joi from 'joi';

export const categoryValidator = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow('').optional()
  });