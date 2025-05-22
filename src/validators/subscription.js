import Joi from "joi";

export const subscriptionSchema = Joi.object({
  firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
  contactPerson: Joi.number().required(),
  startDate: Joi.date().required(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
  frequency: Joi.string()
    .valid("daily", "weekly", "monthly", "yearly")
    .required(),
  paymentMethod: Joi.string().valid("Cash", "Mobile Money", "Bank Transfer"),
});
