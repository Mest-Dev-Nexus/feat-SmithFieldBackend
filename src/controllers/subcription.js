import { SubscriptionModel } from "../models/subscription.js";
import { subscriptionSchema } from "../validators/subscription.js";

export const createSubscription = async (req, res, next) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const subscription = await SubscriptionModel.create({
      ...value,
      userId: req.auth.id, 
    });
    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
};


export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await SubscriptionModel.find();
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await SubscriptionModel.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (err) {
    next(err);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updated = await SubscriptionModel.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const deleted = await SubscriptionModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    next(err);
  }
};
