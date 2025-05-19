import { Router } from "express";
import { getFarmerProducts } from "../controllers/farmer.js";
import { authorizeRole } from "../middlewares/auth.js";




export const farmerProductRouter = Router();








farmerProductRouter.get("/products/farmer-consumer", authorizeRole(["Farmer"]), getFarmerProducts);


