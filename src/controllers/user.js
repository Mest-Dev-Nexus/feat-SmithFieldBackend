import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import {
  registerUserValidator,
  loginUserValidator,
} from "../validators/user.js";
import { mailTransporter } from "../utils/mailing.js";
import { registerUserMailTemplate } from "../utils/mailing.js";

export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.message });
    }
    const existingUser = await UserModel.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(value.password, 10);

    const newUser = await UserModel.create({
      ...value,
      password: hashedPassword,
    });
    await mailTransporter.sendMail({
      from: "trudykingsberry@gmail.com",
      to: value.email,
      subject: "Welcome to Our Platform!",
      html: registerUserMailTemplate.replace("{{username}}", value.username),
    });
    let redirectTo = "/shop";
    if (newUser.role === "Administrator") {
      redirectTo = "/admin/dashboard";
    }
    res.status(201).json({
      message: "User registered successfully!",
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ message: error.message });
    }
    const user = await UserModel.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    let redirectTo = "/shop";
    if (user.role === "Administrator") {
      redirectTo = "/admin/dashboard";
    }
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        role: user.role,
        email: user.email,
        username: user.username,
      },
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { error, value } = updateUserValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }
  const result = await UserModel.findByIdAndUpdate(req.params.id, value);

  res.status(200).json(result);
};
