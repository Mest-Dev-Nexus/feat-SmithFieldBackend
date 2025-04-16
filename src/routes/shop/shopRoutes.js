import { Router } from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  countProducts,
} from "../../controllers/shop/shopController.js";
import { isAuthenticated, isAuthorized } from "../../middlewares/auth.js";
import { imageUpload } from "../../middlewares/upload.js";

export const shopRouter = Router();

shopRouter.post(
  "/add/product",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  imageUpload.single("image"),
  addProduct
);

shopRouter.get("/get/products", getProducts);
shopRouter.get("/get/product/:id", getProductById);
shopRouter.get("/count/products", countProducts);

shopRouter.patch(
  "/patch/product/:id",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  updateProduct
);

shopRouter.delete(
  "/del/product/:id",
  isAuthenticated,
  isAuthorized(["Administrator"]),
  deleteProduct
);
