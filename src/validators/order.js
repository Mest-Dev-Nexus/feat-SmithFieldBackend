import Joi from 'joi';

export const orderValidationSchema = Joi.object({

  deliveryAddress: Joi.string().required(),
  city: Joi.string().required(),
  phoneNumber: Joi.number().required(),
  paymentStatus: Joi.string()
    .valid('pending', 'shipped', 'delivered', 'cancelled')
    .default('pending'),
  totalPrice: Joi.number().positive().required(),
  deliveryFee: Joi.number().optional(),
  
});