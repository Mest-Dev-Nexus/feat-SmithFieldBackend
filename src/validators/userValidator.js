import Joi from "joi";

export const registerUserValidator = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

export const loginUserValidator = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().required().min(8),
});

export const updateUserValidator = Joi.object({
  role: Joi.string()
    .valid("Administrator", "Farmer", "user", "staff")
    .required(),
});
