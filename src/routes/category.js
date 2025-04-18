import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.js";
import { isAuthenticated } from "../middlewares/auth.js";

const categoryRouter = express.Router();

categoryRouter.post("/createCategory", isAuthenticated, createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", isAuthenticated, updateCategory);
categoryRouter.delete("/:id", isAuthenticated, deleteCategory);

export default categoryRouter;
