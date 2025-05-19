import bcrypt from "bcrypt";
import crypto from "crypto"
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import {
  registerUserValidator,
  loginUserValidator,
  forgotPasswordValidator, resetPasswordValidator
} from "../validators/user.js";
import {
  mailTransporter,
  registerUserMailTemplate,
  resetPasswordMailTemplate,
} from "../utils/mailing.js";

export const registerUser = async (req, res, next) => {
  try {
    const requestBody = {
      role: "Consumer",
      ...req.body,
    };
    if (
      (requestBody.role === "Consumer" || !requestBody.role) &&
      !requestBody.consumerType
    ) {
      requestBody.consumerType = "normalConsumer";
    }
    const { error, value } = registerUserValidator.validate(requestBody, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return res.status(422).json({ message: error.message });
    }
    const existingUser = await UserModel.findOne({ email: value.email });

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
      html: registerUserMailTemplate.replace("{{username}}", value.firstname),
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

    const user = await UserModel.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        consumerType: user.consumerType, 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

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
        firstName: user.firstname,
        lastName: user.lastname,
      },
      redirectTo,
    });
  } catch (error) {
    next(error);
  }
};


//Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await UserModel.findOne({ email: value.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; 

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

    await mailTransporter.sendMail({
      from: "trudykingsberry@gmail.com",
      to: user.email,
      subject: "Reset Your Password",
      html: resetPasswordMailTemplate(user.username, resetLink),
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    next(error);
  }
};


//Reset Password 

export const resetPassword = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { error, value } = resetPasswordValidator.validate(req.body);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!value.token) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    const user = await UserModel.findOne({
      resetToken: value.token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};


export const updateUser = async (req, res, next) => {
  try {
    const { error, value } = updateUserValidator.validate({
      ...req.body,
      profilePicture: req.file?.filename || "",
    });
    if (error) {
      return res.status(422).json({
        message: "Validation failed",
        details: error.details,
      });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.auth.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
