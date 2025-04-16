import Joi from "joi";

export const registerUserValidator = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref("password"),
  role: Joi.string().required().valid("Administrator", "Farmer", "Consumer"),
  consumerType: Joi.string()
    .valid("normalConsumer", "Food Processor", "Bulk Buyer")
    .when("role", {
      is: "Consumer",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
}).with("password", "confirmPassword");

export const loginUserValidator = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().required().min(8),
});

export const updateUserValidator = Joi.object({
  role: Joi.string().valid("Administrator", "Farmer", "Consumer").required(),
});
