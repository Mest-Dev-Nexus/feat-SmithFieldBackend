import { Router } from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subcription.js";
import { isAuthenticated, authorizeRole } from "../middlewares/auth.js";

export const subscriptionRouter = Router();

subscriptionRouter.post(
  "/subscriptions",
  isAuthenticated,
  authorizeRole("retail"),
  createSubscription
);
subscriptionRouter.get("/subscriptions", isAuthenticated, getAllSubscriptions);
subscriptionRouter.get("/subscriptions/:id", isAuthenticated, getSubscriptionById);
subscriptionRouter.put(
  "/subscriptions/:id",
  isAuthenticated,
  authorizeRole("retail"),
  updateSubscription
);
subscriptionRouter.delete(
  "/subscriptions/:id",
  isAuthenticated,
  authorizeRole("retail"),
  deleteSubscription
);
