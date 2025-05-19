import { expressjwt } from "express-jwt";
import { UserModel } from "../models/user.js";

export const isAuthenticated = expressjwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

//authorization
export const isAuthorized = (roles) => {
  return async (req, res, next) => {
    const user = await UserModel.findById(req.auth.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (roles?.includes(user.role)) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "you are not authorized to access this resource" });
    }
  };
};


// middleware/authorizeRole.js
export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    console.log('req.auth:', req.auth);
    const { role, consumerType } = req.auth || {};

    if (!role) {
      return res.status(401).json({ message: "Unauthorized: No role assigned" });
    }

    // Allow access based on consumerType (only if role is 'Consumer')
    if (role === "Consumer" && allowedRoles.includes(consumerType)) {
      return next();
    }

    // Allow access based on general role (e.g., 'Administrator')
    if (allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  };
};

