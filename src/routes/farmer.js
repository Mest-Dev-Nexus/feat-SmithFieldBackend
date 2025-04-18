//fetch farmer-consumer products
//filter .where the consumer = farmer
import express from "express";
import { getFarmerProducts } from "../controllers/farmer.js";

const farmerProductRouter = express.Router();

farmerProductRouter.get("/products/farmer-consumer", getFarmerProducts);

export default farmerProductRouter;
