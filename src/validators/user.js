import Joi from "joi";

export const registerUserValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref("password"),
  role: Joi.string()
    .valid("Administrator", "Farmer", "Consumer")
    .default("Consumer"),
  consumerType: Joi.string()
    .valid("normalConsumer", "Retailer", "Wholesaler")
    .when("role", {
      is: "Consumer",
      then: Joi.required().default("normalConsumer"),
      otherwise: Joi.optional(),
    }),
  resetToken: Joi.string().optional(),
  resetTokenExpiry: Joi.date().optional(),
}).with("password", "confirmPassword");



export const loginUserValidator = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().required().min(8),
});

export const updateUserValidator = Joi.object({
  role: Joi.string().valid("Administrator", "Farmer", "Consumer").required(),
});

export const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({'any.only': 'Passwords do not match'})
});
