import { Router } from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  countProducts,
} from "../controllers/products.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { imageUpload } from "../middlewares/upload.js";

export const productRouter = Router();

productRouter.post(
  "/add/product",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  imageUpload.single("image"),
  addProduct
);

productRouter.get("/get/products", getProducts);
productRouter.get("/get/products/:id", getProductById);
productRouter.get("/count/products", countProducts);

productRouter.patch(
  "/patch/products/:id",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  updateProduct
);

productRouter.delete(
  "/del/products/:id",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  deleteProduct
);

//filter .where by
