import express from "express";
import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.js";
import { isAuthenticated } from "../middlewares/auth.js";

export const categoryRouter = Router();

categoryRouter.post("/createCategory", isAuthenticated, createCategory);
categoryRouter.get('/categories', getCategories);
categoryRouter.get("/categories/:shopType", getCategories);
categoryRouter.get("/categories/:id", getCategoryById);
categoryRouter.patch("/categories/:id", isAuthenticated, updateCategory);
categoryRouter.delete("/categories/:id", isAuthenticated, deleteCategory);


